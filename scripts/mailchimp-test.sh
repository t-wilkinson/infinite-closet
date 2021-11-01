#!/usr/bin/bash

dc="us19"
apikey="7689fa4da0c6233b920f5b9079ee4f81-us19"
contacts_id="0966cdac14"

curl -sS \
  "https://${dc}.api.mailchimp.com/3.0/lists/${contacts_id}/members" \
  --user "anystring:${apikey}" | jq -r
