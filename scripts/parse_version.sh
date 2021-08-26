#!/usr/bin/env bash
_VERSION=$(cat "${REPO_NAME}/Telegram/SourceFiles/kotato/kotato_version.h" | grep "AppKotatoVersion " | awk '{print $5}' | sed 's/.$//')
_VERSIONSTR=$(cat "${REPO_NAME}/Telegram/SourceFiles/kotato/kotato_version.h" | grep "AppKotatoVersionStr " | awk '{print $5}' | sed 's/.$//' | cut -d'"' -f 2)
_ISBETA=$(cat "${REPO_NAME}/Telegram/SourceFiles/kotato/kotato_version.h" | grep "AppKotatoBetaVersion " | awk '{print $5}' | sed 's/.$//')
_BETA_SWITCH=""
_VERSIONSTRFULL=${_VERSIONSTR}
test "$_ISBETA" != "true" || _BETA_SWITCH=" -beta"
test $(awk -F"." '{print NF-1}' <<< "${_VERSIONSTR}") -ge 2 || _VERSIONSTRFULL=${_VERSIONSTR}.0
echo "Version: ${_VERSION}"
echo "Version string: ${_VERSIONSTR}"
echo "Full version string: ${_VERSIONSTRFULL}"
echo "Beta switch for packer: ${_BETA_SWITCH}"
echo "VERSION_NUM=${_VERSION}" >> $GITHUB_ENV
echo "VERSION_STR=${_VERSIONSTR}" >> $GITHUB_ENV
echo "VERSION_STR_FULL=${_VERSIONSTRFULL}" >> $GITHUB_ENV
echo "PACKER_BETA=${_BETA_SWITCH}" >> $GITHUB_ENV
