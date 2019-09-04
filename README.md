# CROWS

![](https://i.ibb.co/7KKgd16/cover.png)

CROWS is a Proof-of-Concept for a CRowdsourced Open Weather System. It is a submitted project for [Hackster.IO's Machine Money: Empowering Devices with Wallets](https://www.hackster.io/contests/machine-money-with-iota) competition.



How does it run?

## Server
1. Clone the repository and prepare the dependencies
    ```bash
    git clone https://github.com/thundo/crows-iota.git
    cd core
    yarn install
    cd ../server
    yarn install
    ```
2. Generate a IOTA seed for your wallet. If you don't know how to do that, follow [these instructions](https://iota.guide/seed/how-to-generate-iota-wallet-seed/)
3. Create your `config/local.json` file which overrides the default configuration. It should be something like
   ```json
   {
      "iota": {
          "seed": "P9LSRMEPXTBRFQTDVVVIRNEPCSJYNYAKWHZUIRLARWWLXMVOHHJZJOWPAKCVFRVCTWQGOCIBY9ZENDPUR"
          }
   }
   ```
    The `iota.seed` should be the IOTA seed generated at point 2
4. (Optional) You can mess with the CROWS settings like payment interval, logging level or IOTA remote node and security. Just look at `config/default.json` and override the relevant parts in `config/local.json`
5. Start the server with
    ```bash
    yarn dev
    ```
6. During startup please note the address generated from your IOTA seed which will be the address the stations sends their measurements to. The same can be seen in web interface hovering above the QR code. By default the web interface is reachable at `http://localhost:8080` once the server is running.

## Raspberry Setup (Weather Station with dht22)
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

sudo apt install -y nodejs yarn git
```

## Client
1. Still logged on the PI, clone the repository and prepare the dependencies
    ```bash
    git clone https://github.com/thundo/crows-iota.git
    cd core
    yarn install
    cd ../client
    yarn install
    ```
2. Generate a IOTA seed for your wallet. If you don't know how to do that, follow [these instructions](https://iota.guide/seed/how-to-generate-iota-wallet-seed/)
3. Create your `config/local.json` file which overrides the default configuration. It should be something like
    ```json
    {
        "id": "CROWS_STATION_0",
        "name": "Crows Weather Station 0",
        "latitude": 45,
        "longitude": 9,
        "altitude": 80,
        "iota": {
            "seed": "OEJDD9YRHZLIPHCMTVMLREPISX9CQERNEXNCIXQKMQOLILXPIBMRGZPWWYXVWNQBHOZOBVVFRGOSJXS9M",
            "serverAddress": "VTMPVYGXMIMJHYROFIHYBODLIXZYMAUTOWVEURKSDSLEHPENKSCWXVJJWIJPBHVAZNFHIDNVTUBIYMCB9"
        },
        "crows": {
            "baseUrl": "http://192.168.0.1:8080",
            "sensor": {
                "pin": 4,
                "type": 22
             }
        }
    }
    ```
    
    Let's review these settings:
    - `id`: an identifier for your station (string)
    - `name`: a display name for your station (string)
    - `latitude`, `longitude`, `altitude`: geolocation of the station (numeric)
    - `iota.seed`: the IOTA seed generated at point 2 (string). It should be the one generated at point 2
    - `iota.serverAddress`: the IOTA server address shown during server startup (string)
    - `crows.baseUrl`: the web address of the CROWS Server. By default it listens on port 8080 - (string)
    - `crows.sensor.pin`, `crows.sensor.type`: configuration for the DHT sensor. Pin specifies the DATA pin connected to the sensor, while type should be 22 (or 11) depending on the DHT sensor type (numeric)
4. (Optional) You can override additional settings like logging level or IOTA remote node and security. Just look at `config/default.json` and override the relevant parts in `config/local.json`
5. Start the client with
```bash
yarn dev
```
After a few moments the station should register and send measurements.
