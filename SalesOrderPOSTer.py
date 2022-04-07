import oauth2 as oauth
import requests
import time

def postToNetsuite(payload):
    # POST to NS RESTlet
    url = 'restlet-deploy-link-here'
    token = oauth.Token(key='token-key', secret='token-secret')
    consumer = oauth.Consumer(key='consumer-key', secret='consumer-secret')
    httpMethod = 'POST'
    realm = 'account-id'

    params = {
        'oauth_version': '1.0',
        'oauth_nonce': oauth.generate_nonce(),
        'oauth_timestamp': str(int(time.time())),
        'oauth_token': token.key,
        'oauth_consumer_key': consumer.key
    }

    req = oauth.Request(method=httpMethod, url=url, parameters=params)

    signatureMethod = oauth.SignatureMethod_HMAC_SHA256()
    req.sign_request(signatureMethod, consumer, token)
    header = req.to_header(realm)
    headery = header['Authorization'].encode('ascii', 'ignore')
    headerx = {'Authorization': headery, 'Content-Type':'application/json'}
    print(headerx)

    conn = requests.post(url=url, headers=headerx, data=payload)
    print(conn.text)