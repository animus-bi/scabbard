import logging


logger = logging.getLogger(__name__)


def build_kubectl_config(cluster_details, token):
    cert = cluster_details["certificateAuthority"]["data"]
    endpoint = cluster_details["endpoint"]
    return {
        "apiVersion": "v1",
        "kind": "Config",
        "clusters": [
            {
                "cluster": {
                    "server": str(endpoint),
                    "certificate-authority-data": str(cert)
                },
                "name": "kubernetes"
            }
        ],
        "contexts": [
            {
                "context": {
                    "cluster": "kubernetes",
                    "user": "aws"
                },
                "name": "aws"
            }
        ],
        "current-context": "aws",
        "preferences": {},
        "users": [
            {
                "name": "aws",
                "user": {"token": str(token)}
            }
        ]
    }


def query_cluster_details(client, name):
    try:
        return client.describe_cluster(name=name).get('cluster', {})
    except client.exceptions.ResourceNotFoundException:
        region = client.meta.config.region_name
        raise ClusterDoesNotExist(f"Cluster {name} not found in {region} region.") from None


class ClusterDoesNotExist(Exception):
    pass