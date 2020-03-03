---
date: '2020-01-08T09:59:25Z'
menu:
- corda-os-4.3
title: 'API: Service Classes'
version: corda-os-4.3
---



# API: Service Classes

Service classes are long-lived instances that can trigger or be triggered by flows from within a node. A Service class is limited to a
            single instance per node. During startup, the node handles the creation of the service.

Services allow related, reusable, functions to be separated into their own class where their functionality is
            grouped together. These functions can then be called from other services or flows.


## Creating a Service

To define a Service class:

> 
> 
> * Add the `CordaService` annotation
> 
> 
> * Add a constructor with a single parameter of `AppServiceHub`
> 
> 
> * Extend `SingletonSerializeAsToken`
> 
> 
Below is an empty implementation of a Service class:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
@CordaService
class MyCordaService(private val serviceHub: AppServiceHub) : SingletonSerializeAsToken() {

    init {
        // code ran at service creation / node startup
    }

    // public api of service
}
```

</TabPanel>
<TabPanel value={value} index={1}>

```java
@CordaService
public class MyCordaService extends SingletonSerializeAsToken {

    private AppServiceHub serviceHub;

    public MyCordaService(AppServiceHub serviceHub) {
        this.serviceHub = serviceHub;
        // code ran at service creation / node startup
    }

    // public api of service
}
```

</TabPanel>

</div>
The `AppServiceHub` provides the `ServiceHub` functionality to the Service class, with the extra ability to start flows. Starting flows
                from `AppServiceHub` is explained further in [Starting Flows from a Service](#starting-flows-from-a-service).

Code can be run during node startup when the class is being initialised. To do so, place the code into the `init` block or constructor.
                This is useful when a service needs to establish a connection to an external database or setup observables via `ServiceHub.trackBy` during
                its startup. These can then persist during the service’s lifetime.


## Retrieving a Service

A Service class can be retrieved by calling `ServiceHub.cordaService` which returns the single instance of the class passed into the function:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val service: MyCordaService = serviceHub.cordaService(MyCordaService::class.java)
```

</TabPanel>
<TabPanel value={value} index={1}>

```java
MyCordaService service = serviceHub.cordaService(MyCordaService.class);
```

</TabPanel>

</div>
<div class="r3-o-warning" role="alert"><span>Warning: </span>


`ServiceHub.cordaService` should not be called during initialisation of a flow and should instead be called in line where
                    needed or set after the flow’s `call` function has been triggered.


</div>

## Starting Flows from a Service

Starting flows via a service can lead to deadlock within the node’s flow worker queue, which will prevent new flows from
                starting. To avoid this, the rules bellow should be followed:

> 
> 
> * When called from a running flow, the service must invoke the new flow from another thread. The existing flow cannot await the
>                             execution of the new flow.
> 
> 
> * When `ServiceHub.trackBy` is placed inside the service, flows started inside the observable must be placed onto another thread.
> 
> 
> * Flows started by other means, do not require any special treatment.
> 
> 
<div class="r3-o-note" role="alert"><span>Note: </span>


It is possible to avoid deadlock without following these rules depending on the number of flows running within the node. But, if the
                    number of flows violating these rules reaches the flow worker queue size, then the node will deadlock. It is best practice to
                    abide by these rules to remove this possibility.


</div>

