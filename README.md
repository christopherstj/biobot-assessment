# biobot-assessment
Take-home assessment for biobot interview

# How To Run Locally

Run the following on your local command line  
`git clone https://github.com/christopherstj/biobot-assessment.git`  
`cd biobot-assessment/`  
`npm i`  
`cd client/`  
`npm i`  
`cd ..`  
`npm run dev`  

Yes, the usual high severity warnings from react-scripts are there.

## Next Steps

There are a couple things I would improve about this. Here's a list:  

- Improve the backend to be more scalable, limiting array to 10 elements no matter what
    - The issue that I would love advice on is sorting. It would be easy to just limit the array, but making sure I'm dropping/adding the correct items in the correct place to maintain the sort would take a bit more trial and error than I had time for. 
- FedEx API Integration
    - I would love to use the tracking numbers to make use of the FedEx tracking information. I would most likely display the info similarly to how I did in the page (taking some time to make it look a bit better), and use the previous tracking history to plot out a map on the bottom of the card. I would probably plop a Google Map down there (I've had a good amount of experience implementing the Google Maps APIs in a React app) and plot out the path the shipment has taken so far.
- Save shipment
    - I would also want to add the functionality to save label ID's so when I went back to the page, I would have a list of shipments that I could easily click on and get info for. That way I, as a client, wouldn't need to search for my shipment every time. I would also make it optional to add an email address to receive updates on what status that shipment is in (I assume you already have that, so that clients get notified about where their kit is in the whole workflow, but if you didn't, I would definitely say that would be important)