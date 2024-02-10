
FROM rabbitmq:3-management AS BASE
WORKDIR /

RUN mkdir -p /init
COPY ./definitions.default.json /init
COPY ./init.sh /init
COPY ./entrypoint.sh /init

RUN chmod +x ./init/init.sh

CMD /bin/bash ./init/entrypoint.sh