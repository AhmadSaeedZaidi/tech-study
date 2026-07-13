# Deploying to Oracle Cloud VPS

This guide covers the **one-time** server setup required before the GitHub
Actions workflow can deploy. The workflow itself lives in
`.github/workflows/deploy.yml` and runs automatically on every push to `main`.

The workflow copies the repo to `~/app` on the VPS and runs a single
`nginx:alpine` Docker container (`js-projects`) on port 80, serving all four
projects:

- `http://<your-domain>/colour_changer/`
- `http://<your-domain>/bmi_calculator/`
- `http://<your-domain>/digital_clock/`
- `http://<your-domain>/guess_the_number/`

---

## 1. Install Docker on the VPS

SSH into your Oracle VPS, then:

```bash
# Install Docker (works on Ubuntu / Oracle Linux)
curl -fsSL https://get.docker.com | sh

# Allow running docker without sudo (log out and back in afterwards)
sudo usermod -aG docker $USER

# Verify
docker --version
```

> The default Oracle user is usually `ubuntu` (Ubuntu image) or `opc`
> (Oracle Linux image). Use whichever you already SSH with.

## 2. Open port 80 in the Oracle VCN (important!)

Oracle Cloud blocks traffic at the **network layer**, so opening a port with
`ufw`/`iptables` on the instance is **not enough**. You must also allow it in
the VCN **Security List**:

1. Go to **Oracle Cloud Console → Networking → Virtual Cloud Networks**.
2. Open the VCN attached to your instance.
3. Click the **Security List** (usually "Default Security List").
4. **Add Ingress Rule**:
   - Source CIDR: `0.0.0.0/0`
   - IP Protocol: `TCP`
   - Destination Port Range: `80` (add `443` too if you will add HTTPS later)
5. Save.

If you also use a host firewall, allow the port there too:

```bash
sudo ufw allow 80/tcp   # only if ufw is active
```

## 3. Point your DuckDNS domain at the VPS

You are using DuckDNS (`opencodeserver.duckdns.org`), so you do **not** create
an A record at a registrar — DuckDNS manages DNS for you. Just tell DuckDNS
which IP your subdomain points to:

1. Go to **https://www.duckdns.org** and log in.
2. In your subdomain list, find **`opencodeserver`**.
3. Set its **current IP** to your Oracle VPS **public IP address**.
4. Click **update**.

DuckDNS now maintains the A record automatically. The change is usually live
within a minute. Use `opencodeserver.duckdns.org` as the `VPS_HOST` secret.

> Note: DuckDNS is dynamic DNS. Oracle VPS public IPs are stable while the
> instance runs, but if you stop/deallocate it the IP can change. If that
> happens, re-run the update above, or set up the DuckDNS update script
> (cron/`ddclient`) on the VPS to keep it current.

## 4. Add the deploy SSH key

The workflow authenticates with an SSH key. The private half becomes the
`VPS_SSH_KEY` GitHub secret; the public half must be in the VPS
`authorized_keys` (you likely already have key-based SSH working — if so, you
can reuse that key pair, or generate a dedicated deploy key):

```bash
# On the VPS, ensure your public key is present:
cat ~/.ssh/authorized_keys
```

If you generate a new dedicated key locally, append its public part to the
VPS file:

```bash
echo "ssh-ed25519 AAAA...your-public-key..." >> ~/.ssh/authorized_keys
```

## 5. Configure GitHub secrets

In the repo: **Settings → Secrets and variables → Actions → New repository
secret**. Add:

| Secret         | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| `VPS_HOST`     | your domain or the VPS public IP                             |
| `VPS_USER`     | the SSH user (`ubuntu` or `opc`)                             |
| `VPS_SSH_KEY`  | the **private** key contents (`-----BEGIN ... PRIVATE KEY-----`) |

> Keep the private key secret. Never commit it to the repo.

## 6. Deploy

Push to `main` (or merge a PR into `main`). The Actions tab will show the run.
Once green, visit `http://<your-domain>/colour_changer/`.

To redeploy manually on the VPS at any time:

```bash
cd ~/app
docker build -t js-projects .
docker stop js-projects; docker rm js-projects
docker run -d --name js-projects --restart unless-stopped -p 80:80 js-projects
```

---

## Optional: HTTPS with certbot

After the site works over HTTP:

```bash
sudo apt update && sudo apt install -y certbot
sudo certbot certonly --webroot -w /var/www/html -d <your-domain>
```

Then mount the certs into the container and switch nginx to port 443, or run
`certbot` with the nginx plugin on the host and proxy to the container. Ask for
a follow-up if you want this wired into the workflow.
