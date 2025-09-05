#!/bin/bash
set -e

# Ensure ownership
sudo chown -R ec2-user:ec2-user /home/ec2-user
sudo chmod -R 755 /home/ec2-user

# Run build as ec2-user
su - ec2-user <<'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Sync latest code
rsync -av --delete ~/application-code/web-tier/ ~/web-tier/

cd ~/web-tier
npm install
npm run build
EOF

# (Now back to root after EOF)

# Replace nginx config
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx-backup.conf || true
sudo cp -f /home/ec2-user/application-code/nginx.conf /etc/nginx/nginx.conf

# Validate config before reload
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
