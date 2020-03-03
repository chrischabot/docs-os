---
date: '2020-01-08T09:59:25Z'
menu:
- corda-os-4.1
title: 'API: Core types'
version: corda-os-4.1
---



# API: Core types

Corda provides several more core classes as part of its API.


## SecureHash

The `SecureHash` class is used to uniquely identify objects such as transactions and attachments by their hash.
                Any object that needs to be identified by its hash should implement the `NamedByHash` interface:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
/** Implemented by anything that can be named by a secure hash value (e.g. transactions, attachments). */
interface NamedByHash {
    val id: SecureHash
}

```

</TabPanel>
![github](/images/svg/github.svg "github") [Structures.kt](https://github.com/corda/corda/blob/release/os/4.1/core/src/main/kotlin/net/corda/core/contracts/Structures.kt)


</div>
`SecureHash` is a sealed class that only defines a single subclass, `SecureHash.SHA256`. There are utility methods
                to create and parse `SecureHash.SHA256` objects.


## CompositeKey

Corda supports scenarios where more than one signature is required to authorise a state object transition. For example:
                “Either the CEO or 3 out of 5 of his assistants need to provide signatures”.

This is achieved using a `CompositeKey`, which uses public-key composition to organise the various public keys into a
                tree data structure. A `CompositeKey` is a tree that stores the cryptographic public key primitives in its leaves and
                the composition logic in the intermediary nodes. Every intermediary node specifies a *threshold* of how many child
                signatures it requires.

An illustration of an *“either Alice and Bob, or Charlie”* composite key:

![composite key](resources/composite-key.png "composite key")To allow further flexibility, each child node can have an associated custom *weight* (the default is 1). The *threshold*
                then specifies the minimum total weight of all children required. Our previous example can also be expressed as:

![composite key 2](resources/composite-key-2.png "composite key 2")Signature verification is performed in two stages:

> 
> 
> * Given a list of signatures, each signature is verified against the expected content.
> 
> 
> * The public keys corresponding to the signatures are matched against the leaves of the composite key tree in question,
>                             and the total combined weight of all children is calculated for every intermediary node. If all thresholds are satisfied,
>                             the composite key requirement is considered to be met.
> 
> 

