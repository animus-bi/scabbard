from datetime import datetime, timedelta
from time import sleep
from typing import Dict
from exceptions import DoesNotExist
import logging


logger = logging.getLogger(__name__)


def create(client, name: str, role, vpc_details, tags: Dict = None):
    tags = {} if tags is None else tags
    vpc_config = {'subnetIds': vpc_details['subnet_ids']}
    try:
        response = client.create_cluster(name=name,
                                         resourcesVpcConfig=vpc_config,
                                         roleArn=role['Arn'],
                                         tags=tags)
    except client.exceptions.ResourceInUseException:
        logger.warning(f"Cluster with name {name} already exists")
        response = client.describe_cluster(name=name)
    cluster = response['cluster']
    logger.info(f"Cluster details: {cluster}")
    return cluster


def destroy(client, name: str):
    try:
        response = client.delete_cluster(name=name)
    except client.exceptions.ResourceNotFoundException:
        raise DoesNotExist(f"No cluster with name '{name}' exists")
    logger.info(f"Cluster {name} destroyed")
    return response


def status(client, name):
    try:
        response = client.describe_cluster(name=name)
    except client.exceptions.ResourceNotFoundException:
        raise DoesNotExist(f"No cluster with name '{name}' exists")
    return response['cluster']['status']


def wait_for_status(client, name: str, expected_status: str, timeout: int = None, sleep_interval: int = None):
    timeout = 300 if timeout is None else timeout
    sleep_interval = 5 if sleep_interval is None else sleep_interval
    start_time = datetime.now()
    end_time = start_time + timedelta(seconds=timeout)
    while True:
        cluster_state = status(client, name)
        logger.debug(f"Cluster {name} has state {cluster_state}")
        if cluster_state == expected_status:
            return True
        if datetime.now() > end_time:
            wait_time = datetime.now() - start_time
            msg = f"Timeout: Waited {wait_time.seconds} seconds for cluster {name} to have status {status}"
            logger.warning(msg)
            raise TimeoutError(msg)
        sleep(sleep_interval)