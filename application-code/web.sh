#!/bin/bash
set -e   # exit if any command fails

# Ensure ownership of home
sudo chown -R ec2-user:ec2-user /home/ec2-user
sudo chmod -R 755 /home/ec2-user

# Run everything as ec2-user (so nvm/npm are available)
su - ec2-user <<'EOF'
# Load nvm environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Copy code into web-tier
cp -rf ~/application-code/web-tier ~/web-tier
cd ~/web-tier

# Install dependencies and build
npm install
npm run build
EOF

# Replace nginx config
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx-backup.conf
sudo cp -rf cd /home/ec2-user/application-code/nginx.conf /etc/nginx/nginx.conf

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
