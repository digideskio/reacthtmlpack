import {
  default as React,
} from "react";

import {
  WebpackScriptEntry
} from "../../../lib/entry";

export default (
  <html>
    <head>
      <title>React Google Maps | tomchentw</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta charSet="UTF-8" />
      <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing" />
    </head>
    <body>
      <div id="react-container" />
      <WebpackScriptEntry
        chunkName="assets/client"
        chunkFilepath="./scripts/client.js"
        configFilepath="../SimpleScript.webpackConfig.js"
      />
    </body>
  </html>
);
