FROM	     alpine:3.18

RUN        apk update && apk add --no-cache postgresql postgresql-client su-exec

RUN        adduser -D aatbir

RUN        mkdir -p /var/lib/postgresql/data && chown -R postgres:postgres /var/lib/postgresql/data
RUN        mkdir -p /run/postgresql && chown -R postgres:postgres /run/postgresql    

COPY       conf.sh /conf.sh
COPY       automate_db.sh /automate_db.sh
RUN        chmod +x /conf.sh /automate_db.sh

# Run as root initially, script will switch to postgres after fixing permissions

EXPOSE     5432

CMD ["/conf.sh"]
