export default function customService() {
  const app = this;

  app.use('/load-info', (req, res) => {
    res.json({
      message: 'This came from the api server',
      time: Date.now()
    });
  });

  app.use('/visitors', (req, res) => {
    res.json({
      authenticated: app.channel('authenticated').connections.map(con => con.user),
      anonymous: app.channel('anonymous').connections.length
    });
  });
}
