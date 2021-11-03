#!/usr/bin/bash

dc="us19"
apikey="7689fa4da0c6233b920f5b9079ee4f81-us19"
contacts_id="0966cdac14"

# curl -X GET \
#   "https://${dc}.api.mailchimp.com/3.0/lists/${contacts_id}/members?count=200&fields=members.full_name,members.email_address,members.status,members.timestamp_signup,members.last_changed" \
#   --user "anystring:${apikey}" | jq -r

curl -X GET \
  "https://${dc}.api.mailchimp.com/3.0/templates" \
  --user "anystring:${apikey}"

