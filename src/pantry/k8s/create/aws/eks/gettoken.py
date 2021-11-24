from typing import Optional
import base64


CLUSTER_NAME_HEADER = 'x-k8s-aws-id'
TOKEN_PREFIX = 'k8s-aws-v1.'
TOKEN_EXPIRATION_MINS = 14
URL_TIMEOUT = 60


def get_presigned_url(sts_client, cluster_name, url_timeout: Optional[int] = None):
    if url_timeout is None:
        url_timeout = URL_TIMEOUT
    return sts_client.generate_presigned_url(
        'get_caller_identity',
        Params={'ClusterName': cluster_name},
        ExpiresIn=url_timeout,
        HttpMethod='GET',
    )


def get_token(sts_client, cluster_name):
    _register_cluster_name_handlers(sts_client)
    url = get_presigned_url(sts_client, cluster_name)
    token = TOKEN_PREFIX + base64.urlsafe_b64encode(url.encode('utf-8')).decode('utf-8').rstrip('=')
    return token


# The following function is excluded from code coverage because it is an event handler.
def _inject_cluster_name_header(request, **_kwargs):  # pragma: no cover
    if 'eks_cluster' in request.context:
        request.headers[
            CLUSTER_NAME_HEADER] = request.context['eks_cluster']


def _register_cluster_name_handlers(sts_client):
    sts_client.meta.events.register(
        'provide-client-params.sts.GetCallerIdentity',
        _retrieve_cluster_name
    )
    sts_client.meta.events.register(
        'before-sign.sts.GetCallerIdentity',
        _inject_cluster_name_header
    )


# The following function is excluded from code coverage because it is an event handler.
def _retrieve_cluster_name(params, context, **_kwargs):  # pragma: no cover
    if 'ClusterName' in params:
        context['eks_cluster'] = params.pop('ClusterName')