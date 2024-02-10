export const configuration = () => ({
  node_port: parseInt(process.env.NODE_PORT),
  smtp_config: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    from: '"InventorySystem" <donotreply@temp.in>',
  },
  aws_config: {
    bucket_name: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION,
    access_key: process.env.AWS_ACCESS_KEY,
    secret_key: process.env.AWS_SECRET_KEY,
  },
});
