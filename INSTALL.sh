sudo apt update -y && sudo apt upgrade -y
git clone https://github.com/creationix/nvm.git ~/.nvm
sudo echo "source ~/.nvm/nvm.sh" >> ~/.bashrc && sudo echo "source ~/.nvm/nvm.sh" >> ~/.profile
nvm install 9.0.0
nvm use 9.0.0
npm install

echo "SETUP SUCCESSFULL"
echo "RUN WITH node main.js"