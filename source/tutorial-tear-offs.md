---
date: '2020-01-08T09:59:25Z'
menu:
- corda-os-4.4
title: Transaction tear-offs
version: corda-os-4.4
---




Suppose we want to construct a transaction that includes commands containing interest rate fix data as in
            [Writing oracle services](oracles). Before sending the transaction to the oracle to obtain its signature, we need to filter out every part
            of the transaction except for the `Fix` commands.

To do so, we need to create a filtering function that specifies which fields of the transaction should be included.
            Each field will only be included if the filtering function returns *true* when the field is passed in as input.

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val filtering = Predicate<Any> {
    when (it) {
        is Command<*> -> oracle.owningKey in it.signers && it.value is Fix
        else -> false
    }
}

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTearOffs.kt](https://github.com/corda/corda/blob/release/os/4.4/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/tutorial/tearoffs/TutorialTearOffs.kt)


</div>
We can now use our filtering function to construct a `FilteredTransaction`:

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
val ftx: FilteredTransaction = stx.buildFilteredTransaction(filtering)

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTearOffs.kt](https://github.com/corda/corda/blob/release/os/4.4/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/tutorial/tearoffs/TutorialTearOffs.kt)


</div>
In the Oracle example this step takes place in `RatesFixFlow` by overriding the `filtering` function. See
            [Using an oracle](oracles#filtering-ref).

Both `WireTransaction` and `FilteredTransaction` inherit from `TraversableTransaction`, so access to the
            transaction components is exactly the same. Note that unlike `WireTransaction`,
            `FilteredTransaction` only holds data that we wanted to reveal (after filtering).

<div><Tabs value={value} aria-label="code tabs"><Tab label="kotlin" /></Tabs>
<TabPanel value={value} index={0}>

```kotlin
// Direct access to included commands, inputs, outputs, attachments etc.
val s: List<Command<*>> = ftx.commands
val ins: List<StateRef> = ftx.inputs
val timeWindow: TimeWindow? = ftx.timeWindow
// ...

```

</TabPanel>
![github](/images/svg/github.svg "github") [TutorialTearOffs.kt](https://github.com/corda/corda/blob/release/os/4.4/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/tutorial/tearoffs/TutorialTearOffs.kt)


</div>
The following code snippet is taken from `NodeInterestRates.kt` and implements a signing part of an Oracle.

```kotlin
fun sign(ftx: FilteredTransaction): TransactionSignature {
    ftx.verify()
    // Performing validation of obtained filtered components.
    fun commandValidator(elem: Command<*>): Boolean {
        require(services.myInfo.legalIdentities.first().owningKey in elem.signers && elem.value is Fix) {
            "Oracle received unknown command (not in signers or not Fix)."
        }
        val fix = elem.value as Fix
        val known = knownFixes[fix.of]
        if (known == null || known != fix)
            throw UnknownFix(fix.of)
        return true
    }

    fun check(elem: Any): Boolean {
        return when (elem) {
            is Command<*> -> commandValidator(elem)
            else -> throw IllegalArgumentException("Oracle received data of different type than expected.")
        }
    }

    require(ftx.checkWithFun(::check))
    ftx.checkCommandVisibility(services.myInfo.legalIdentities.first().owningKey)
    // It all checks out, so we can return a signature.
    //
    // Note that we will happily sign an invalid transaction, as we are only being presented with a filtered
    // version so we can't resolve or check it ourselves. However, that doesn't matter much, as if we sign
    // an invalid transaction the signature is worthless.
    return services.createSignature(ftx, services.myInfo.legalIdentities.first().owningKey)
}

```
[NodeInterestRates.kt](https://github.com/corda/corda/blob/release/os/4.4/samples/irs-demo/cordapp/workflows-irs/src/main/kotlin/net.corda.irs/api/NodeInterestRates.kt)<div class="r3-o-note" role="alert"><span>Note: </span>


The way the `FilteredTransaction` is constructed ensures that after signing of the root hash it’s impossible to add or remove
                components (leaves). However, it can happen that having transaction with multiple commands one party reveals only subset of them to the Oracle.
                As signing is done now over the Merkle root hash, the service signs all commands of given type, even though it didn’t see
                all of them. In the case however where all of the commands should be visible to an Oracle, one can type `ftx.checkAllComponentsVisible(COMMANDS_GROUP)` before invoking `ftx.verify`.
                `checkAllComponentsVisible` is using a sophisticated underlying partial Merkle tree check to guarantee that all of
                the components of a particular group that existed in the original `WireTransaction` are included in the received
                `FilteredTransaction`.


</div>

