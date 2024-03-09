
FROM rabbitmq:3-management AS BASE
WORKDIR /

USER root
RUN mkdir -p /init
COPY ./entrypoint.sh /init
COPY ./definitions.default.json /etc/rabbitmq
COPY ./rabbitmq.conf /etc/rabbitmq

RUN chmod +x ./init/entrypoint.sh
CMD /bin/bash ./init/entrypoint.sh