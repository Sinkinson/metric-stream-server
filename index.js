const express = require('express');
const app = express();
const PORT = process.env.PORT || 4318;
const pb = require('google-protobuf');
const bodyParser = require('body-parser');

const pbMetrics = require('./opentelemetry/proto/collector/metrics/v1/metrics_service_pb');

function parseRecord(data) {
    const result = [];

    console.log(data);

    while (data.length) {
        const reader = new pb.BinaryReader(data)
        const messageLength = reader.decoder_.readUnsignedVarint32()
        const messageFrom = reader.decoder_.cursor_
        const messageTo = messageFrom + messageLength
        const message = data.subarray(messageFrom, messageTo)

        const parsed = pbMetrics.ExportMetricsServiceRequest.deserializeBinary(message);

        console.log(parsed);
        result.push(parsed.toObject())

        data = data.subarray(messageTo)
    }

    return result
}

app.use(bodyParser.raw({ type: 'application/x-protobuf' }));

app.all('/*', (req, res) => {
  const result = parseRecord(req.body);
  console.log(result);
  res.status(200).end();
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
