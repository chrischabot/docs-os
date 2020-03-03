---
date: '2020-01-08T09:59:25Z'
menu:
- corda-os-4.1
title: Deploying Corda to Corda Testnet from an Azure Cloud Platform VM
version: corda-os-4.1
---


# Deploying Corda to Corda Testnet from an Azure Cloud Platform VM

This document will describe how to set up a virtual machine on the Azure Cloud Platform to deploy your pre-configured
            Corda node and automatically connnect to Testnet. A self-service download link can be obtained from
            [https://marketplace.r3.com/network/testnet](https://marketplace.r3.com/network/testnet).


## Pre-requisites


* Ensure you have a registered Microsoft Azure account which can create virtual machines.



## Deploy Corda node

Browse to [https://portal.azure.com](https://portal.azure.com) and log in with your Microsoft account.


### STEP 1: Create a Resource Group

Click on the “Resource groups” link in the side nav in the Azure Portal and then click “Add”:

![azure rg](resources/azure-rg.png "azure rg")Fill in the form and click “Create”:

![azure rg 2](resources/azure-rg-2.png "azure rg 2")
### STEP 2: Launch the VM

At the top of the left sidenav click on the button with the green cross “Create a resource”.

In this example we are going to use an Ubuntu server so select the latest Ubuntu Server option:

![azure select ubuntu](resources/azure-select-ubuntu.png "azure select ubuntu")Fill in the form:


* Add a username (to log into the VM) and choose and enter a password


* Choose the resource group we created earlier from the “Use existing” dropdown


* Select a cloud region geographically near to your location to host your VM


Click on “OK”:

![azure vm form](resources/azure-vm-form.png "azure vm form")Choose a size (“D4S_V3 Standard” is recommended if available) and click “Select”:

![azure instance type](resources/azure-instance-type.png "azure instance type")Click on “Public IP address” to open the “Settings” panel

![azure vm settings](resources/azure-vm-settings.png "azure vm settings")Set the IP address to “Static” under “Assignment” and click “OK”:

<div class="r3-o-note" role="alert"><span>Note: </span>


This is so the IP address for your node does not change frequently in the global network map.


</div>
![azure set static ip](resources/azure-set-static-ip.png "azure set static ip")Next toggle “Network Security Group” to advanced and click on “Network security group (firewall)”:

![azure nsg](resources/azure-nsg.png "azure nsg")Add the following inbound rules for ports 8080 (webserver), and 10002-10003 for the P2P and RPC ports used by the Corda
                    node respectively:

```bash
Destination port ranges: 10002, Priority: 1041  Name: Port_10002
Destination port ranges: 10003, Priority: 1042  Name: Port_10003
Destination port ranges: 8080, Priority: 1043  Name: Port_8080
Destination port ranges: 22, Priority: 1044  Name: Port_22
```
<div class="r3-o-note" role="alert"><span>Note: </span>


The priority has to be unique number in the range 900 (highest) and 4096 (lowest) priority. Make sure each
                        rule has a unique priority or there will be a validation failure and error message.


</div>
![azure nsg 2](resources/azure-nsg-2.png "azure nsg 2")Click “OK” and “OK” again on the “Settings” panel:

![azure settings ok](resources/azure-settings-ok.png "azure settings ok")Click “Create” and wait a few minutes for your instance to be provisioned and start running:

![azure create vm](resources/azure-create-vm.png "azure create vm")
### STEP 3: Connect to your VM and set up the environment

Once your instance is running click on the “Connect” button and copy the ssh command:

![azure ssh](resources/azure-ssh.png "azure ssh")Enter the ssh command into your terminal. At the prompt, type “yes” to continue connecting and then enter the password
                    you configured earlier to log into the remote VM:

![azure shell](resources/azure-shell.png "azure shell")
### STEP 4: Download and set up your Corda node

Now that your Azure environment is configured you can switch to the
                    [Testnet dashboard](https://marketplace.r3.com/network/testnet/install-node) and click “Copy” to get a one-time installation
                    script.

<div class="r3-o-note" role="alert"><span>Note: </span>


If you have not already set up your account on Testnet, please visit [https://marketplace.r3.com/network/testnet](https://marketplace.r3.com/network/testnet) and sign
                        up.


</div>
<div class="r3-o-note" role="alert"><span>Note: </span>


You can generate as many Testnet identites as you like by clicking “Generate new node” to generate a new one-time
                        link.


</div>
![testnet platform](resources/testnet-platform.png "testnet platform")In the terminal of your cloud instance, paste the command you just copied to install and run your Corda node:

```bash
sudo ONE_TIME_DOWNLOAD_KEY=YOUR_UNIQUE_DOWNLOAD_KEY_HERE bash -c "$(curl -L https://onboarder.prod.ws.r3.com/api/user/node/TESTNET/install.sh)"
```
<div class="r3-o-warning" role="alert"><span>Warning: </span>


This command will execute the install script as ROOT on your cloud instance. You may wish to examine the
                        script prior to executing it on your machine.


</div>
You can follow the progress of the installation by typing the following command in your terminal:

```bash
tail -f /opt/corda/logs/node-<VM-NAME>.log
```

## Testing your deployment

To test that your deployment is working correctly, follow the instructions in [Using the Node Explorer to test a Corda node on Corda Testnet](testnet-explorer-corda.md) to set up
                the Finance CorDapp and issue cash to a counterparty.

This will also demonstrate how to install a custom CorDapp.


