const pb = require('google-protobuf');

const pbMetrics = require('../opentelemetry/proto/collector/metrics/v1/metrics_service_pb');
const toUint8Array = require('base64-to-uint8array');

function parseRecord(body) {
  const metricData = JSON.parse(JSON.stringify(body));
  const metrics = [];

  for (let record of metricData.records) {
    const base64Str = record.data;
    const Uint8Array = toUint8Array(base64Str);
    const metric = protoConvertor(Uint8Array);
    metrics.push(metric[0]);
  }

  metricData["records"] = metrics;
  return metricData;
}

function protoConvertor(data) {
    const result = [];

    while (data.length) {
        const reader = new pb.BinaryReader(data)
        const messageLength = reader.decoder_.readUnsignedVarint32()
        const messageFrom = reader.decoder_.cursor_
        const messageTo = messageFrom + messageLength
        const message = data.subarray(messageFrom, messageTo)

        const parsed = pbMetrics.ExportMetricsServiceRequest.deserializeBinary(message);

        // result.push(parsed.toObject())
        result.push(objectConvertor(parsed.toObject()));
        data = data.subarray(messageTo)
    }

    return result
}

function objectConvertor(obj) {
  if (!obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map(e => objectConvertor(e));
  } else if (typeof obj === 'object') {
    let newObj = {};
    Object.keys(obj).forEach(key => obj[key] = objectConvertor(obj[key]));
    return newObj;
  } else {
    return obj;
  }
}

exports.parseRecord = parseRecord;
