const themeOptions = require('./theme-options');

module.exports = {
  pathPrefix: '/',
  plugins: [
    {
      resolve: 'gatsby-theme-apollo-docs',
      options: {
        ...themeOptions,
        root: __dirname,
        subtitle: 'Corda Documentation',
        description: 'How to use the Corda platform',
        githubRepo: 'corda/corda',
        sidebarCategories: {
          null: [
            'index', 
            'release-notes',
            'app-upgrade-notes'
          ],
          Development: [
            'quickstart-index',
            'quickstart-deploy',
            'quickstart-build',          
          ],
          'Key Concepts': [
            'key-concepts',
            'key-concepts-ecosystem',
            'key-concepts-ledger',
            'key-concepts-states',
            'key-concepts-transactions',
            'key-concepts-contracts',
            'key-concepts-flows',
            'key-concepts-consensus',
            'key-concepts-notaries',
            'key-concepts-vault',
            'key-concepts-time-windows',
            'key-concepts-oracles',
            'key-concepts-node',
            'key-concepts-tearoffs',
            'key-concepts-tradeoffs',
            'key-concepts-djvm',
            'building-a-cordapp-index',
            'cordapp-overview',
            'getting-set-up',
            'tutorial-cordapp',
            'building-a-cordapp-samples',
            'writing-a-cordapp',
            'cordapp-build-systems',
            'debugging-a-cordapp',
            'secure-coding-guidelines',
            'flow-overriding',
            'flow-cookbook',
          
          ],
          Tutorials: [
            'tutorials-index',
            'hello-world-introduction',
            'hello-world-template',
            'hello-world-state',
            'hello-world-flow',
            'hello-world-running',
            'tut-two-party-introduction',
            'tut-two-party-contract',
            'tut-two-party-flow',
            'tutorial-contract',
            'tutorial-test-dsl',
            'contract-upgrade',
            'tutorial-integration-testing',
            'tutorial-clientrpc-api',
            'tutorial-building-transactions',
            'flow-state-machines',
            'flow-testing.html',
            'oracles',
            'tutorial-custom-notary',
            'tutorial-tear-offs',
            'tutorial-attachments',
            'event-scheduling',
            'tutorial-observer-nodes',
          ],
          Tools: [
            'tools-index',
            'network-builder',
            'network-bootstrapper',
            'demobench',
            'node-explorer',
            'checkpoint-tooling',
            'node-internals-index',
            'node-services',
            'messaging',
            'component-library-index',
            'contract-catalogue',
            'financial-model',
            'contract-irs',
            'serialization-index',
            'serialization',
            'cordapp-custom-serializers',
            'serialization-default-evolution',
            'serialization-enum-evolution',
            'json',
            'blob-inspector',
            'wire-format',
            'versioning-and-upgrades',
            'api-stability-guarantees',
            'api-stability-guarantees',
            'api-stability-guarantees',
            'versioning',
            'upgrading-cordapps',
            'cordapp-constraint-migration',
            'cordapp-upgradeability',
            'cordapp-advanced-concepts',
            'troubleshooting',
          ],
          'Corda API': [
            'api-contracts',
            'api-contract-constraints',
            'api-core-types',
            'api-flows',
            'api-identity',
            'api-persistence',
            'api-rpc',
            'api-service-classes',
            'api-service-hub',
            'api-states',
            'api-testing',
            'api-transactions',
            'api-vault-query',
          ],
          Operations: [
          'corda-nodes-index',
          'node-structure',
          'node-naming',
          'corda-configuration-file',
          'node-commandline',
          'node-administration',
          'deploying-a-node',
          'node-database',
          'node-database-access-h2',
          'node-database-tables',
          'node-operations-upgrade-cordapps',
          'shell.html',
          'clientrpc',
          'generating-a-node',
          'running-a-node',
          'node-flow-hospital',
          ],
          Networks: [
            'corda-networks-index',
            'compatibility-zones',
            'permissioning',
            'network-map',
            'cipher-suites',
            'joining-a-compatibility-zone',
            'corda-testnet-intro',
            'deploy-to-testnet-index',
            'azure-vm-explore',
            'aws-vm-explore',
            'gcp-vm',
            'deploy-locally',
            'testnet-explorer-corda',
            'setting-up-a-dynamic-compatibility-zone',
            'running-a-notary',
            'docker-image',
            'azure-vm',
            'aws-vm',
            'loadtesting',
            'cli-application-shell-extensions',
          ],
        },
      },
    },
  ],
};
