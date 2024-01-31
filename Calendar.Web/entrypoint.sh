#alpine image (commands are different compared to non-alpine docker image)
#!/bin/sh

apk update 
apk add curl sudo
update-ca-certificates
nginx -g "daemon off;"