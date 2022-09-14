FROM navikt/node-express:16

ADD ./ /var/server/

EXPOSE 8020
CMD ["yarn", "start"]