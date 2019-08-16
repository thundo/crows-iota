Weather forecasting is one of the first human activities with the aim to understand the world we live in. At present day, forecasting exploits a large amount of data to run complex physics models.
Commercial weather services, like OpenWeather, collect data from ten of thoundands of connected weather stations every day. This data is then enjoyable by commercial entities or enthusiasts via API in a freemium price model. This revenue model account for the infrastructure needed to run the service. However no revenue stream is in place for weather station owners.
In an age where content creation is becoming more and more a paid activity, why don't weather station owners get paid for their data?

This project is a PoC for a crowdsourced open weather system (CROWS), where owners get paid for quality data collection and creation.



Abuse detection is beyond the scope of this PoC. Patterns, PoW, ...
No scalability


## Setup for Weather Station (w/ ds18b20)
- https://howchoo.com/g/m2qwytdmmjn/raspberry-pi-default-username-and-password
- https://howchoo.com/g/mjk3m2e2njy/find-your-raspberry-pis-ip-address
- https://pinout.xyz/pinout/1_wire

`sudo raspi-config`
images...

`lsmod | grep w1`
`ls -al /sys/bus/w1/devices`

images with devices list and raw reading

`curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -`
`sudo apt-get install -y nodejs`