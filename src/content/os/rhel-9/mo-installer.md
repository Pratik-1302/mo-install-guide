The miniOrange installer bundles Java 17 and Redis. You don't install either manually. The installer auto-detects the OS and deploys the IDP services into `/opt/tomcat/`.

### 4.1 Download the installer

```bash
cd /opt
sudo wget https://miniorange.s3.us-east-1.amazonaws.com/public/installers/mo-installer/mo-installer-5.0.0.zip
sudo unzip mo-installer-5.0.0.zip -d mo-installer-5.0.0
cd /opt/mo-installer-5.0.0
ls -la
```

You should see:

```
.env.sh          Environment configuration (review before sourcing)
mo-installer.sh  Main installer script
moctl/           moctl CLI and bash completion
```

### 4.2 Review and source the environment file

```bash
less .env.sh
source .env.sh
```

> **Note.** In v5.0.0, `.env.sh` does not contain database connection details. The DB connection is configured later through the browser UI at `/initialize`. Source the file as-is.

### 4.3 Set execute permissions

```bash
sudo chmod +x mo-installer.sh moctl/*.sh
```

### 4.4 Run the installer

```bash
sudo bash mo-installer.sh
```

Watch the output for failures. The installer covers:

- **Java 17** — installed automatically
- **Redis** — installed and configured automatically
- **moctl** — installed to `/usr/bin/moctl` with tab completion
- **IDP services** — deployed to `/opt/tomcat/`

At the end of the run, the installer will print:

```
Next step: moctl service start
```

### 4.5 Start the four core services

```bash
moctl service start
```

The core services start in this order:

| Service       | Port | Purpose              |
|---------------|------|----------------------|
| configserver  | 8071 | Configuration        |
| eurekaserver  | 8070 | Service registry     |
| gatekeeper    | 8072 | API gateway          |
| miniorange    | 8080 | Main IDP service     |

### 4.6 Check service status

```bash
moctl service status
```

Only the four core services should be active at this point. Secondary services start after initialisation.

| Symbol           | Meaning                                                |
|------------------|--------------------------------------------------------|
| `● running`      | Active and registered in Eureka                        |
| `△ registering`  | Active but not yet registered; wait and recheck        |
| `△ stopped`      | Inactive                                               |
| `✗ failed`       | Failed; check `moctl log <service>`                    |

### 4.7 Open `/initialize` in a browser

```
https://<SERVER_IP>/initialize
```

You will see a self-signed certificate warning. Proceed past it.

Enter the values from the Database section above, plus the Redis and RabbitMQ values from Section 3 (Redis: `127.0.0.1:6379`, no password by default).

After the wizard completes, the dashboard loads. Navigate to **Settings → Base URL** and set it to your final domain:

```
https://<your-domain>
```

### 4.8 Restart all services

This step starts the secondary services that depend on the completed schema.

```bash
moctl service restart
```

Wait 1–2 minutes for everything to register, then verify in the next section.
