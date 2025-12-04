## This is for MACOS only
## After you have setup your virtual environment with python 3.12.x, you can run the command 'source setup.sh' to install necessary software for holmes-py.

# install gauge
brew install gauge

# Install gauge python
gauge install python --version 0.4.11

# Update pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Install playwright browsers
playwright install
