# Azure function mail socketlabs

## Setup

### Development setup

Create/Update **local.settings.json** with this:
```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "AzureWebJobsServiceBus": "",
    "SOCKETLABS_SERVER_ID": your-socketlabs-server-id,
    "SOCKETLABS_API_KEY": "your-socketlabs-api-key",
    // "E18_URL": "https://e18url.net", // optional
    // "E18_KEY": "secret token", // optional
    // "E18_SYSTEM": "dsf", // optional
    // "E18_EMPTY_JOB": true // optional
  },
  "ConnectionStrings": {}
}
```

<!-- ### E18

To support [E18](https://github.com/vtfk/e18-node#usage), add `E18_URL`, `E18_KEY` and `E18_SYSTEM` -->

### Setup in Azure

1. Publish Azure function
1. In Configuration in your Azure function, add these Application settings
    1. SOCKETLABS_SERVER_ID
    1. SOCKETLABS_API_KEY

## **POST** `/mail`

### without templating

```json
{
  "to": [
    "kari@nordmann.no",
    "bjarne@nordmann.no"
  ],
  "cc": [
    "kjartan@nordmann.no"
  ],
  "bcc": [
    "rolf@nordmann.no"
  ],
  "from": "Ola Nordmann <ola@nordmann.no>",
  "subject": "Test",
  "text": "Heihei",
  "html": "<b>Heihei</b>"
}
```

### with templating

```json
{
  "to": [
    "kari@nordmann.no",
    "bjarne@nordmann.no"
  ],
  "cc": [
    "kjartan@nordmann.no"
  ],
  "bcc": [
    "rolf@nordmann.no"
  ],
  "from": "Ola Nordmann <ola@nordmann.no>",
  "subject": "Test",
  "template": {
    "templateName": "example",
    "templateData": {
      "body": "<i>Something</i>.", // can also be an array of strings
      "signature": {
        "name": "Ola Nordmann",
        "title": "Boss",
        "department": "Computer geek",
        "company": "Example company",
        "phone": "81549300",
        "mobile": "01189998819919117253"
      }
    }
  }
}
```

### bulk send
When you don't want the receivers to see the other receivers

**REMARK: When using bulk - you will receive status 200, and list of suceeded and failed mails. You must retry failed yourself, if you want to**

Add `"type": 'bulk'` to the payload to enable bulk send

*Works for both templating and not templating*


```json
{
  "to": [
    "kari@nordmann.no",
    "bjarne@nordmann.no"
  ],
  "cc": [
    "kjartan@nordmann.no"
  ],
  "bcc": [
    "rolf@nordmann.no"
  ],
  "type": "bulk", // Like this
  "from": "Ola Nordmann <ola@nordmann.no>",
  "subject": "Test",
  "text": "Heihei",
  "html": "<b>Heihei</b>"
}
```


### with attachments

```json
{
  ...,
  "attachments": [
    {
      "content": "document in base64",
      "filename": "name of file",
      "type": "application/json"
    }
  ]
}
```

## **GET** `/template/{template}`

Get template handlebars

### Get all templates

**/template/all**


### Get specific template

**/template/example**
