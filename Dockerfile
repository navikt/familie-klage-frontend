FROM navikt/node-express:18

ADD ./ /var/server/

EXPOSE 8020
CMD ["yarn", "start"]