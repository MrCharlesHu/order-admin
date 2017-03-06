#!/bin/bash
rsync --exclude-from=./rsync.excl --progress --password-file=./rsync.pass -av .. charles@120.77.207.162::order-admin