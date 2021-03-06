---
date: '2020-01-08T09:59:25Z'
menu:
- corda-os-4.4
title: The CorDapp Template
version: corda-os-4.4
---




When writing a new CorDapp, you’ll generally want to start from one of the standard templates:


* The [Java Cordapp Template](https://github.com/corda/cordapp-template-java)


* The [Kotlin Cordapp Template](https://github.com/corda/cordapp-template-kotlin)


The Cordapp templates provide the boilerplate for developing a new CorDapp. CorDapps can be written in either Java or Kotlin. We will be
            providing the code in both languages throughout this tutorial.

Note that there’s no need to download and install Corda itself. The required libraries are automatically downloaded from an online Maven
            repository and cached locally.


## Downloading the template

Open a terminal window in the directory where you want to download the CorDapp template, and run the following command:

<div><Tabs value={value} aria-label="code tabs"><Tab label="java" /><Tab label="kotlin" /></Tabs>
<TabPanel value={value} index={0}>

```java
git clone https://github.com/corda/cordapp-template-java.git ; cd cordapp-template-java
```

</TabPanel>
<TabPanel value={value} index={1}>

```kotlin
git clone https://github.com/corda/cordapp-template-kotlin.git ; cd cordapp-template-kotlin
```

</TabPanel>

</div>

## Opening the template in IntelliJ

Once the template is download, open it in IntelliJ by following the instructions here:
                [https://docs.corda.net/tutorial-cordapp.html#opening-the-example-cordapp-in-intellij](https://docs.corda.net/tutorial-cordapp.html#opening-the-example-cordapp-in-intellij).


## Template structure

For this tutorial, we will only be modifying the following files:

<div><Tabs value={value} aria-label="code tabs"><Tab label="java" /><Tab label="kotlin" /></Tabs>
<TabPanel value={value} index={0}>

```java
// 1. The state
contracts/src/main/java/com/template/states/TemplateState.java

// 2. The flow
workflows/src/main/java/com/template/flows/Initiator.java
```

</TabPanel>
<TabPanel value={value} index={1}>

```kotlin
// 1. The state
contracts/src/main/kotlin/com/template/states/TemplateState.kt

// 2. The flow
workflows/src/main/kotlin/com/template/flows/Flows.kt
```

</TabPanel>

</div>

## Progress so far

We now have a template that we can build upon to define our IOU CorDapp. Let’s start by defining the `IOUState`.


