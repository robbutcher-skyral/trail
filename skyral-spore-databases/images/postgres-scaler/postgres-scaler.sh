#!/bin/sh

set -Eeuo pipefail

COMMAND=$1
POSTGRES_CLUSTER=$2
NAMESPACE=$3

case $COMMAND in
on | off)

	# command to turn off a cluster actually means we're putting hibernation on, so flip the command
	hibernate=off
	if [ "$COMMAND" = "off" ]; then
		hibernate=on
	fi

	kubectl annotate cluster $POSTGRES_CLUSTER --namespace $NAMESPACE --overwrite cnpg.io/hibernation=$hibernate
	;;
*)
	echo "Usage: ./postgres-scaler.sh <on/off> <postgres-cluster> <namespace>"
	;;
esac
