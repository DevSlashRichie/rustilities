module.exports = {
  redis: {
    image: "rabbitmq",
    tag: "3.9-management",
    ports: [5672],
    name: "rabbitmq-test",
    wait: {
      type: "ports",
      timeout: 5,
    },
  },
};
