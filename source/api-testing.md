---
date: '2020-01-08T09:59:25Z'
menu:
- corda-os-4.3
title: 'API: Testing'
version: corda-os-4.3
---



# API: Testing


## Flow testing


### MockNetwork

Flow testing can be fully automated using a `MockNetwork` composed of `StartedMockNode` nodes. Each
                    `StartedMockNode` behaves like a regular Corda node, but its services are either in-memory or mocked out.

A `MockNetwork` is created as follows:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
import net.corda.core.identity.CordaX500Name
import net.corda.testing.node.MockNetwork
import net.corda.testing.node.MockNetworkParameters
import net.corda.testing.node.StartedMockNode
import net.corda.testing.node.TestCordapp.Companion.findCordapp
import org.junit.After
import org.junit.Before

class MockNetworkTestsTutorial {

    private val mockNet = MockNetwork(MockNetworkParameters(listOf(findCordapp("com.mycordapp.package"))))

    @After
    fun cleanUp() {
        mockNet.stopNodes()
    }

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
import net.corda.core.identity.CordaX500Name;
import net.corda.testing.node.MockNetwork;
import net.corda.testing.node.MockNetworkParameters;
import net.corda.testing.node.StartedMockNode;
import org.junit.After;
import org.junit.Before;

import static java.util.Collections.singletonList;
import static net.corda.testing.node.TestCordapp.findCordapp;

public class MockNetworkTestsTutorial {

    private final MockNetwork mockNet = new MockNetwork(new MockNetworkParameters(singletonList(findCordapp("com.mycordapp.package"))));

    @After
    public void cleanUp() {
        mockNet.stopNodes();
    }

```

</TabPanel>
![github](/images/svg/github.svg "github") [MockNetworkTestsTutorial.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/MockNetworkTestsTutorial.kt) | [MockNetworkTestsTutorial.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/main/java/net/corda/docs/java/MockNetworkTestsTutorial.java)


</div>
The `MockNetwork` requires at a minimum a list of CorDapps to be installed on each `StartedMockNode`. The CorDapps are looked up on the
                    classpath by package name, using `TestCordapp.findCordapp`. `TestCordapp.findCordapp` scans the current classpath to find the CorDapp that contains the given package.
                    This includes all the associated CorDapp metadata present in its MANIFEST.

`MockNetworkParameters` provides other properties for the network which can be tweaked. They default to sensible values if not specified.


### Adding nodes to the network

Nodes are created on the `MockNetwork` using:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
    private lateinit var nodeA: StartedMockNode
    private lateinit var nodeB: StartedMockNode

    @Before
    fun setUp() {
        nodeA = mockNet.createNode()
        // We can optionally give the node a name.
        nodeB = mockNet.createNode(CordaX500Name("Bank B", "London", "GB"))
    }

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
    private StartedMockNode nodeA;
    private StartedMockNode nodeB;

    @Before
    public void setUp() {
        nodeA = mockNet.createNode();
        // We can optionally give the node a name.
        nodeB = mockNet.createNode(new CordaX500Name("Bank B", "London", "GB"));
    }

```

</TabPanel>
![github](/images/svg/github.svg "github") [MockNetworkTestsTutorial.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/MockNetworkTestsTutorial.kt) | [MockNetworkTestsTutorial.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/main/java/net/corda/docs/java/MockNetworkTestsTutorial.java)


</div>
Nodes added using `createNode` are provided a default set of node parameters. However, it is also possible to
                    provide different parameters to each node using `MockNodeParameters`. Of particular interest are `configOverrides` which allow you to
                    override some of the default node configuration options. Please refer to the `MockNodeConfigOverrides` class for details what can currently
                    be overridden. Also, the `additionalCordapps` parameter allows you to add extra CorDapps to a specific node. This is useful when you wish
                    for all nodes to load a common CorDapp but for a subset of nodes to load CorDapps specific to their role in the network.


### Running the network

When using a `MockNetwork`, you must be careful to ensure that all the nodes have processed all the relevant messages
                    before making assertions about the result of performing some action. For example, if you start a flow to update the ledger
                    but don’t wait until all the nodes involved have processed all the resulting messages, your nodes’ vaults may not be in
                    the state you expect.

When `networkSendManuallyPumped` is set to `false`, you must manually initiate the processing of received messages.
                    You manually process received messages as follows:


* `StartedMockNode.pumpReceive()` processes a single message from the node’s queue


* `MockNetwork.runNetwork()` processes all the messages in every node’s queue until there are no further messages to
                            process


When `networkSendManuallyPumped` is set to `true`, nodes will automatically process the messages they receive. You
                    can block until all messages have been processed using `MockNetwork.waitQuiescent()`.

<div class="r3-o-warning" role="alert"><span>Warning: </span>


If `threadPerNode` is set to `true`, `networkSendManuallyPumped` must also be set to `true`.


</div>

### Running flows

A `StartedMockNode` starts a flow using the `StartedNodeServices.startFlow` method. This method returns a future
                    representing the output of running the flow.

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val signedTransactionFuture = nodeA.services.startFlow(IOUFlow(iouValue = 99, otherParty = nodeBParty))
```

</TabPanel>
<TabPanel value={value} index={1}>

```java
CordaFuture<SignedTransaction> future = startFlow(a.getServices(), new ExampleFlow.Initiator(1, nodeBParty));
```

</TabPanel>

</div>
The network must then be manually run before retrieving the future’s value:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val signedTransactionFuture = nodeA.services.startFlow(IOUFlow(iouValue = 99, otherParty = nodeBParty))
// Assuming network.networkSendManuallyPumped == false.
network.runNetwork()
val signedTransaction = future.get();
```

</TabPanel>
<TabPanel value={value} index={1}>

```java
CordaFuture<SignedTransaction> future = startFlow(a.getServices(), new ExampleFlow.Initiator(1, nodeBParty));
// Assuming network.networkSendManuallyPumped == false.
network.runNetwork();
SignedTransaction signedTransaction = future.get();
```

</TabPanel>

</div>

### Accessing `StartedMockNode` internals


#### Querying a node’s vault

Recorded states can be retrieved from the vault of a `StartedMockNode` using:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val myStates = nodeA.services.vaultService.queryBy<MyStateType>().states
```

</TabPanel>
<TabPanel value={value} index={1}>

```java
List<MyStateType> myStates = node.getServices().getVaultService().queryBy(MyStateType.class).getStates();
```

</TabPanel>

</div>
This allows you to check whether a given state has (or has not) been stored, and whether it has the correct attributes.


#### Examining a node’s transaction storage

Recorded transactions can be retrieved from the transaction storage of a `StartedMockNode` using:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val transaction = nodeA.services.validatedTransactions.getTransaction(transaction.id)
```

</TabPanel>
<TabPanel value={value} index={1}>

```java
SignedTransaction transaction = nodeA.getServices().getValidatedTransactions().getTransaction(transaction.getId())
```

</TabPanel>

</div>
This allows you to check whether a given transaction has (or has not) been stored, and whether it has the correct
                        attributes.

This allows you to check whether a given state has (or has not) been stored, and whether it has the correct attributes.


### Further examples


* See the flow testing tutorial [here](flow-testing.md)


* See the oracle tutorial [here](oracles.md) for information on testing `@CordaService` classes


* Further examples are available in the Example CorDapp in
                            [Java](https://github.com/corda/samples/blob/release-V4/cordapp-example/workflows-java/src/test/java/com/example/test/flow/IOUFlowTests.java) and
                            [Kotlin](https://github.com/corda/samples/blob/release-V4/cordapp-example/workflows-kotlin/src/test/kotlin/com/example/test/flow/IOUFlowTests.kt)



## Contract testing

The Corda test framework includes the ability to create a test ledger by calling the `ledger` function
                on an implementation of the `ServiceHub` interface.


### Test identities

You can create dummy identities to use in test transactions using the `TestIdentity` class:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val bigCorp = TestIdentity((CordaX500Name("BigCorp", "New York", "GB")))

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
private static final TestIdentity bigCorp = new TestIdentity(new CordaX500Name("BigCorp", "New York", "GB"));

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTestDSL.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/kotlin/net/corda/docs/kotlin/tutorial/testdsl/TutorialTestDSL.kt) | [TutorialTestDSL.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/java/net/corda/docs/java/tutorial/testdsl/TutorialTestDSL.java)


</div>
`TestIdentity` exposes the following fields and methods:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val identityParty: Party = bigCorp.party
val identityName: CordaX500Name = bigCorp.name
val identityPubKey: PublicKey = bigCorp.publicKey
val identityKeyPair: KeyPair = bigCorp.keyPair
val identityPartyAndCertificate: PartyAndCertificate = bigCorp.identity
```

</TabPanel>
<TabPanel value={value} index={1}>

```java
Party identityParty = bigCorp.getParty();
CordaX500Name identityName = bigCorp.getName();
PublicKey identityPubKey = bigCorp.getPublicKey();
KeyPair identityKeyPair = bigCorp.getKeyPair();
PartyAndCertificate identityPartyAndCertificate = bigCorp.getIdentity();
```

</TabPanel>

</div>
You can also create a unique `TestIdentity` using the `fresh` method:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val uniqueTestIdentity: TestIdentity = TestIdentity.fresh("orgName")
```

</TabPanel>
<TabPanel value={value} index={1}>

```java
TestIdentity uniqueTestIdentity = TestIdentity.Companion.fresh("orgName");
```

</TabPanel>

</div>

### MockServices

A mock implementation of `ServiceHub` is provided in `MockServices`. This is a minimal `ServiceHub` that
                    suffices to test contract logic. It has the ability to insert states into the vault, query the vault, and
                    construct and check transactions.

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
private val ledgerServices = MockServices(
        // A list of packages to scan for cordapps
        listOf("net.corda.finance.contracts"),
        // The identity represented by this set of mock services. Defaults to a test identity.
        // You can also use the alternative parameter initialIdentityName which accepts a
        // [CordaX500Name]
        megaCorp,
        mock<IdentityService>().also {
    doReturn(megaCorp.party).whenever(it).partyFromKey(megaCorp.publicKey)
    doReturn(null).whenever(it).partyFromKey(bigCorp.publicKey)
    doReturn(null).whenever(it).partyFromKey(alice.publicKey)
})

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
    ledgerServices = new MockServices(
            // A list of packages to scan for cordapps
            singletonList("net.corda.finance.contracts"),
            // The identity represented by this set of mock services. Defaults to a test identity.
            // You can also use the alternative parameter initialIdentityName which accepts a
            // [CordaX500Name]
            megaCorp,
            // An implementation of [IdentityService], which contains a list of all identities known
            // to the node. Use [makeTestIdentityService] which returns an implementation of
            // [InMemoryIdentityService] with the given identities
            makeTestIdentityService(megaCorp.getIdentity())
    );

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTestDSL.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/kotlin/net/corda/docs/kotlin/tutorial/testdsl/TutorialTestDSL.kt) | [TutorialTestDSL.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/java/net/corda/docs/java/tutorial/testdsl/TutorialTestDSL.java)


</div>
Alternatively, there is a helper constructor which just accepts a list of `TestIdentity`. The first identity provided is
                    the identity of the node whose `ServiceHub` is being mocked, and any subsequent identities are identities that the node
                    knows about. Only the calling package is scanned for cordapps and a test `IdentityService` is created
                    for you, using all the given identities.

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
@Suppress("unused")
private val simpleLedgerServices = MockServices(
        // This is the identity of the node
        megaCorp,
        // Other identities the test node knows about
        bigCorp,
        alice
)

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
private final MockServices simpleLedgerServices = new MockServices(
        // This is the identity of the node
        megaCorp,
        // Other identities the test node knows about
        bigCorp,
        alice
);

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTestDSL.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/kotlin/net/corda/docs/kotlin/tutorial/testdsl/TutorialTestDSL.kt) | [TutorialTestDSL.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/java/net/corda/docs/java/tutorial/testdsl/TutorialTestDSL.java)


</div>

### Writing tests using a test ledger

The `ServiceHub.ledger` extension function allows you to create a test ledger. Within the ledger wrapper you can create
                    transactions using the `transaction` function. Within a transaction you can define the `input` and
                    `output` states for the transaction, alongside any commands that are being executed, the `timeWindow` in which the
                    transaction has been executed, and any `attachments`, as shown in this example test:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
@Test
fun simpleCPMoveSuccess() {
    val inState = getPaper()
    ledgerServices.ledger(dummyNotary.party) {
        transaction {
            input(CP_PROGRAM_ID, inState)
            command(megaCorp.publicKey, CommercialPaper.Commands.Move())
            attachments(CP_PROGRAM_ID)
            timeWindow(TEST_TX_TIME)
            output(CP_PROGRAM_ID, "alice's paper", inState.withOwner(alice.party))
            verifies()
        }
    }
}

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
@Test
public void simpleCPMoveSuccess() {
    ICommercialPaperState inState = getPaper();
    ledger(ledgerServices, l -> {
        l.transaction(tx -> {
            tx.input(JCP_PROGRAM_ID, inState);
            tx.command(megaCorp.getPublicKey(), new JavaCommercialPaper.Commands.Move());
            tx.attachments(JCP_PROGRAM_ID);
            tx.timeWindow(TEST_TX_TIME);
            tx.output(JCP_PROGRAM_ID, "alice's paper", inState.withOwner(alice.getParty()));
            return tx.verifies();
        });
        return Unit.INSTANCE;
    });
}

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTestDSL.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/kotlin/net/corda/docs/kotlin/tutorial/testdsl/TutorialTestDSL.kt) | [TutorialTestDSL.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/java/net/corda/docs/java/tutorial/testdsl/TutorialTestDSL.java)


</div>
Once all the transaction components have been specified, you can run `verifies()` to check that the given transaction is valid.


#### Checking for failure states

In order to test for failures, you can use the `failsWith` method, or in Kotlin the `fails with` helper method, which
                        assert that the transaction fails with a specific error. If you just want to assert that the transaction has failed without
                        verifying the message, there is also a `fails` method.

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
@Test
fun simpleCPMoveFails() {
    val inState = getPaper()
    ledgerServices.ledger(dummyNotary.party) {
        transaction {
            input(CP_PROGRAM_ID, inState)
            command(megaCorp.publicKey, CommercialPaper.Commands.Move())
            attachments(CP_PROGRAM_ID)
            `fails with`("the state is propagated")
        }
    }
}

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
@Test
public void simpleCPMoveFails() {
    ICommercialPaperState inState = getPaper();
    ledger(ledgerServices, l -> {
        l.transaction(tx -> {
            tx.input(JCP_PROGRAM_ID, inState);
            tx.command(megaCorp.getPublicKey(), new JavaCommercialPaper.Commands.Move());
            tx.attachments(JCP_PROGRAM_ID);
            return tx.failsWith("the state is propagated");
        });
        return Unit.INSTANCE;
    });
}

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTestDSL.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/kotlin/net/corda/docs/kotlin/tutorial/testdsl/TutorialTestDSL.kt) | [TutorialTestDSL.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/java/net/corda/docs/java/tutorial/testdsl/TutorialTestDSL.java)


</div>
<div class="r3-o-note" role="alert"><span>Note: </span>


The transaction DSL forces the last line of the test to be either a `verifies` or `fails with` statement.


</div>

#### Testing multiple scenarios at once

Within a single transaction block, you can assert several times that the transaction constructed so far either passes or
                        fails verification. For example, you could test that a contract fails to verify because it has no output states, and then
                        add the relevant output state and check that the contract verifies successfully, as in the following example:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
@Test
fun simpleCPMoveFailureAndSuccess() {
    val inState = getPaper()
    ledgerServices.ledger(dummyNotary.party) {
        transaction {
            input(CP_PROGRAM_ID, inState)
            command(megaCorp.publicKey, CommercialPaper.Commands.Move())
            attachments(CP_PROGRAM_ID)
            `fails with`("the state is propagated")
            output(CP_PROGRAM_ID, "alice's paper", inState.withOwner(alice.party))
            verifies()
        }
    }
}

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
@Test
public void simpleCPMoveSuccessAndFailure() {
    ICommercialPaperState inState = getPaper();
    ledger(ledgerServices, l -> {
        l.transaction(tx -> {
            tx.input(JCP_PROGRAM_ID, inState);
            tx.command(megaCorp.getPublicKey(), new JavaCommercialPaper.Commands.Move());
            tx.attachments(JCP_PROGRAM_ID);
            tx.failsWith("the state is propagated");
            tx.output(JCP_PROGRAM_ID, "alice's paper", inState.withOwner(alice.getParty()));
            return tx.verifies();
        });
        return Unit.INSTANCE;
    });
}

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTestDSL.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/kotlin/net/corda/docs/kotlin/tutorial/testdsl/TutorialTestDSL.kt) | [TutorialTestDSL.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/java/net/corda/docs/java/tutorial/testdsl/TutorialTestDSL.java)


</div>
You can also use the `tweak` function to create a locally scoped transaction that you can make changes to
                        and then return to the original, unmodified transaction. As in the following example:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
@Test
fun `simple issuance with tweak and top level transaction`() {
    ledgerServices.transaction(dummyNotary.party) {
        output(CP_PROGRAM_ID, "paper", getPaper()) // Some CP is issued onto the ledger by MegaCorp.
        attachments(CP_PROGRAM_ID)
        tweak {
            // The wrong pubkey.
            command(bigCorp.publicKey, CommercialPaper.Commands.Issue())
            timeWindow(TEST_TX_TIME)
            `fails with`("output states are issued by a command signer")
        }
        command(megaCorp.publicKey, CommercialPaper.Commands.Issue())
        timeWindow(TEST_TX_TIME)
        verifies()
    }
}

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
@Test
public void simpleIssuanceWithTweakTopLevelTx() {
    transaction(ledgerServices, tx -> {
        tx.output(JCP_PROGRAM_ID, "paper", getPaper()); // Some CP is issued onto the ledger by MegaCorp.
        tx.attachments(JCP_PROGRAM_ID);
        tx.tweak(tw -> {
            tw.command(bigCorp.getPublicKey(), new JavaCommercialPaper.Commands.Issue());
            tw.timeWindow(TEST_TX_TIME);
            return tw.failsWith("output states are issued by a command signer");
        });
        tx.command(megaCorp.getPublicKey(), new JavaCommercialPaper.Commands.Issue());
        tx.timeWindow(TEST_TX_TIME);
        return tx.verifies();
    });
}

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTestDSL.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/kotlin/net/corda/docs/kotlin/tutorial/testdsl/TutorialTestDSL.kt) | [TutorialTestDSL.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/java/net/corda/docs/java/tutorial/testdsl/TutorialTestDSL.java)


</div>

#### Chaining transactions

The following example shows that within a `ledger`, you can create more than one `transaction` in order to test chains
                        of transactions. In addition to `transaction`, `unverifiedTransaction` can be used, as in the example below, to create
                        transactions on the ledger without verifying them, for pre-populating the ledger with existing data. When chaining transactions,
                        it is important to note that even though a `transaction` `verifies` successfully, the overall ledger may not be valid. This can
                        be verified separately by placing a `verifies` or `fails` statement  within the `ledger` block.

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /><Tab label="java" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
@Test
fun `chain commercial paper double spend`() {
    val issuer = megaCorp.party.ref(123)
    ledgerServices.ledger(dummyNotary.party) {
        unverifiedTransaction {
            attachments(Cash.PROGRAM_ID)
            output(Cash.PROGRAM_ID, "alice's $900", 900.DOLLARS.CASH issuedBy issuer ownedBy alice.party)
        }

        // Some CP is issued onto the ledger by MegaCorp.
        transaction("Issuance") {
            output(CP_PROGRAM_ID, "paper", getPaper())
            command(megaCorp.publicKey, CommercialPaper.Commands.Issue())
            attachments(CP_PROGRAM_ID)
            timeWindow(TEST_TX_TIME)
            verifies()
        }

        transaction("Trade") {
            input("paper")
            input("alice's $900")
            output(Cash.PROGRAM_ID, "borrowed $900", 900.DOLLARS.CASH issuedBy issuer ownedBy megaCorp.party)
            output(CP_PROGRAM_ID, "alice's paper", "paper".output<ICommercialPaperState>().withOwner(alice.party))
            command(alice.publicKey, Cash.Commands.Move())
            command(megaCorp.publicKey, CommercialPaper.Commands.Move())
            verifies()
        }

        transaction {
            input("paper")
            // We moved a paper to another pubkey.
            output(CP_PROGRAM_ID, "bob's paper", "paper".output<ICommercialPaperState>().withOwner(bob.party))
            command(megaCorp.publicKey, CommercialPaper.Commands.Move())
            verifies()
        }

        fails()
    }
}

```

</TabPanel>
<TabPanel value={value} index={1}>

```java
@Test
public void chainCommercialPaperDoubleSpend() {
    PartyAndReference issuer = megaCorp.ref(defaultRef);
    ledger(ledgerServices, l -> {
        l.unverifiedTransaction(tx -> {
            tx.output(Cash.PROGRAM_ID, "alice's $900",
                    new Cash.State(issuedBy(DOLLARS(900), issuer), alice.getParty()));
            tx.attachments(Cash.PROGRAM_ID);
            return Unit.INSTANCE;
        });

        // Some CP is issued onto the ledger by MegaCorp.
        l.transaction("Issuance", tx -> {
            tx.output(JCP_PROGRAM_ID, "paper", getPaper());
            tx.command(megaCorp.getPublicKey(), new JavaCommercialPaper.Commands.Issue());
            tx.attachments(JCP_PROGRAM_ID);
            tx.timeWindow(TEST_TX_TIME);
            return tx.verifies();
        });

        l.transaction("Trade", tx -> {
            tx.input("paper");
            tx.input("alice's $900");
            tx.output(Cash.PROGRAM_ID, "borrowed $900", new Cash.State(issuedBy(DOLLARS(900), issuer), megaCorp.getParty()));
            JavaCommercialPaper.State inputPaper = l.retrieveOutput(JavaCommercialPaper.State.class, "paper");
            tx.output(JCP_PROGRAM_ID, "alice's paper", inputPaper.withOwner(alice.getParty()));
            tx.command(alice.getPublicKey(), new Cash.Commands.Move());
            tx.command(megaCorp.getPublicKey(), new JavaCommercialPaper.Commands.Move());
            return tx.verifies();
        });

        l.transaction(tx -> {
            tx.input("paper");
            JavaCommercialPaper.State inputPaper = l.retrieveOutput(JavaCommercialPaper.State.class, "paper");
            // We moved a paper to other pubkey.
            tx.output(JCP_PROGRAM_ID, "bob's paper", inputPaper.withOwner(bob.getParty()));
            tx.command(megaCorp.getPublicKey(), new JavaCommercialPaper.Commands.Move());
            return tx.verifies();
        });
        l.fails();
        return Unit.INSTANCE;
    });
}

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTestDSL.kt](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/kotlin/net/corda/docs/kotlin/tutorial/testdsl/TutorialTestDSL.kt) | [TutorialTestDSL.java](https://github.com/corda/corda/blob/release/os/4.3/docs/source/example-code/src/test/java/net/corda/docs/java/tutorial/testdsl/TutorialTestDSL.java)


</div>

### Further examples


* See the flow testing tutorial [here](tutorial-test-dsl.md)


* Further examples are available in the Example CorDapp in
                            [Java](https://github.com/corda/samples/blob/release-V4/cordapp-example/workflows-java/src/test/java/com/example/test/flow/IOUFlowTests.java) and
                            [Kotlin](https://github.com/corda/samples/blob/release-V4/cordapp-example/workflows-kotlin/src/test/kotlin/com/example/test/flow/IOUFlowTests.kt)



