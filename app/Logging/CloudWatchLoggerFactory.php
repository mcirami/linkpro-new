<?php

namespace App\Logging;

use Aws\CloudWatchLogs\CloudWatchLogsClient;
use PhpNexus\Cwh\Handler\CloudWatch;
use Monolog\Formatter\JsonFormatter;
use Monolog\Logger;

class CloudWatchLoggerFactory {

    /**
     * Create a custom Monolog instance.
     *
     * @param  array  $config
     * @return \Monolog\Logger
     */
    public function __invoke(array $config)
    {
        $sdkParams = $config["sdk"];
        $tags = $config["tags"] ?? [ ];
        $name = $config["name"] ?? 'cloudwatch';

        // Instantiate AWS SDK CloudWatch Logs Client
        $client = new CloudWatchLogsClient($sdkParams);

        // Log group name, will be created if none
        $groupName = config('app.name') . '-' . config('app.env');

        // Log stream name, will be created if none
        // $streamName = config('app.hostname');
        $streamName = $config["cloudwatch_stream_name"];

        // Days to keep logs, 14 by default. Set to `null` to allow indefinite retention.
        $retentionDays = $config["retention"];
        // Instantiate handler (tags are optional)
        $handler = new CloudWatch($client, $groupName, $streamName, $retentionDays, 10000, $tags);
        $handler->setFormatter(new JsonFormatter());
        // Create a log channel
        $logger = new Logger($name);
        // Set handler
        $logger->pushHandler($handler);
        //$logger->pushProcessor(new CompanyLogProcessor()); //Use this if you want to adjust the JSON output using a log processor
        return $logger;
    }
}
