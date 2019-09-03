# CROWS

## Weather Station Setup (raspberry with dht22)
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install -y nodejs yarn git

git clone https://github.com/thundo/crows-iota.git
cd core
yarn install
cd ../client
yarn install
```

## Server Run
```bash
yarn dev
```

## Client Run
```bash
yarn dev
```
