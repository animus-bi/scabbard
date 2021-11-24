# Scabbard

> Scabbard is a super cool cli wrapper that allows you to create recipes for projects and components that can be used to scaffold up various project types for efficiency.

## BETA
- Be advised - this package is still in beta.

## Getting Started

- The idea behind this repo would be to npm install

#### Prerequisites
- linux-like terminal (eg. zsh, bash, [git bash](https://git-scm.com/downloads) for windows)
- Install [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Install [kops](https://kops.sigs.k8s.io/getting_started/install/)
- Install [jq](https://stedolan.github.io/jq/download/)
###### Cloud Providers
- For AWS
  - Install [aws cli](https://aws.amazon.com/cli/)
- For GCP
  - Install [TBD](blah)
- For Azure
  - Install [TBD](blah)

#### Creating a k8s environment for a given cloud provider

> Scabbard: a sheath for the blade of a sword or dagger, typically made of leather or metal.
 - In our case, the scabbard will be our k8s environment, and `scab` will be the command to use to create the scabbard, the sword, the belt, the whatever-you-like.

1. run the following to create an aws environment:
  ```
  scab create \
    --provider aws \
    --profile <aws-profile> \
    --userName <iam-user> \
    --groupName <iam-group> \
    --domainName <route53Domain>
  ```

  - This will run through [this](https://kops.sigs.k8s.io/getting_started/aws/) sequence of steps in a genericized/templatized script




