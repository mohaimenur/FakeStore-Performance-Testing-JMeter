# FakeStore-Performance-Testing-JMeter
Hi,
I’ve completed a performance test on frequently used API for FakeStoreAPI(https://fakestoreapi.com/). 
Test executed for the below mentioned scenario in server 000.000.000.00. 

100 Concurrent Requests with 10 Loop Count; Avg TPS for Total Samples is ~ 105 And Total Concurrent API requested: 29000.
200 Concurrent Requests with 10 Loop Count; Avg TPS for Total Samples is ~ 103 And Total Concurrent API requested: 58000.
300 Concurrent Requests with 10 Loop Count; Avg TPS for Total Samples is ~ 112 And Total Concurrent API requested: 87000.

*** While executed 300 concurrent requests, found  9 requests got connection timeout and error rate is 0.01%. 

*** Summary: Server can handle almost concurrent 85000 API call with almost zero (0) error rate. ***

# Apache JMeter Dashboard for 300 Concurrent Request:
![Jmeter report ss](https://github.com/mohaimenur/FakeStore-Performance-Testing-JMeter/assets/63193648/55cfa67f-e3bb-4c7c-95c9-59d36d530563)


