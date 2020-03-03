---
date: '2020-01-08T09:59:25Z'
menu:
- corda-os-4.4
title: Key concepts
version: corda-os-4.4
---



This section describes the key concepts and features of the Corda platform. It is intended for readers who are new to
            Corda, and want to understand its architecture. It does not contain any code, and is suitable for non-developers.

<div class="r3-o-note" role="alert"><span>Note: </span>


The pages in this section should be read in order.


</div>

The first topics in this section provide an **overview** of the Corda Distributed Ledger:

> 
> 
> * [The network](key-concepts-ecosystem) - The ecosystem that Corda exists in
> 
> 
> * [The ledger](key-concepts-ledger) - The ledger, and how facts on the ledger are shared between nodes
> 
> 
The second set of topics describe the core **CorDapp Concepts**:

> 
> 
> * [States](key-concepts-states) - The states represent shared facts on the ledger
> 
> 
> * [Transactions](key-concepts-transactions) - The transactions update the ledger states
> 
> 
> * [Contracts](key-concepts-contracts) - The contracts govern the ways in which states can evolve over time
> 
> 
> * [Flows](key-concepts-flows) - The flows describe the interactions that must occur between parties to achieve consensus (to satisfy some business requirement)
> 
> 
<div class="r3-o-note" role="alert"><span>Note: </span>


When you build a custom CorDapp, your CorDapp will have state, transaction, contract and flow classes.


</div>
The following **Advanced Corda Concepts** describe important conceptual information:

> 
> 
> * [Consensus](key-concepts-consensus) - How parties on the network reach consensus about shared facts on the ledger
> 
> 
> * [Notaries](key-concepts-notaries) - The component that assures uniqueness consensus (prevents double spends)
> 
> 
> * [Vault](key-concepts-vault) - The component that stores on-ledger shared facts for a node
> 
> 
Finally, some concepts that expand on other areas:

> 
> 
> * [Time-windows](key-concepts-time-windows) - Transactions can be validated as having fallen after, before or within a particular time window
> 
> 
> * [Oracles](key-concepts-oracles) - Transactions can include off-ledger facts retrieved using Oracles
> 
> 
> * [Nodes](key-concepts-node) - Each node contains an instance of Corda, one or more CorDapps, and so on
> 
> 
> * [Transaction tear-offs](key-concepts-tearoffs) - Transactions can be signed by parties who have access to only a limited view of the transaction parts
> 
> 
> * [Trade-offs](key-concepts-tradeoffs) - Trade-offs that have been made in designing Corda and CorDapps
> 
> 
> * [Deterministic JVM](key-concepts-djvm) - Information about the importance and details of the deterministic JVM
> 
> 
The detailed thinking and rationale behind these concepts are presented in two white papers:

> 
> 
> * [Corda: An Introduction](_static/corda-introductory-whitepaper.pdf)
> 
> 
> * [Corda: A Distributed Ledger](_static/corda-technical-whitepaper.pdf) (A.K.A. the Technical White Paper)
> 
> 
Explanations of the key concepts are also available as [videos](https://vimeo.com/album/4555732/).


