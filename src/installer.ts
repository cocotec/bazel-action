let tempDirectory = process.env['RUNNER_TEMP'] || '';

import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import * as tc from '@actions/tool-cache';

/**
 * Downloads a particular version of bazelisk
 * 
 * @param version The version to target. Must correspond to a release on https://github.com/bazelbuild/bazelisk/releases
 */
export async function getBazelisk(version: string): Promise<string> {
    let toolPath = tc.find("bazelisk", version);
    let toolFileName = "bazelisk"
    if (process.platform == "win32") {
        toolFileName += ".exe"
    }

    if (toolPath) {
        core.debug(`Tool found in cache ${toolPath}`)
    } else {
        core.debug('Downloading bazelisk');
        toolPath = await tc.downloadTool(bazeliskDownloadUrl(version))
        toolPath = await tc.cacheFile(toolPath, toolFileName, "bazelisk", version)
    }

    toolPath = path.join(toolPath, toolFileName)

    fs.chmodSync(toolPath, '755');

    return toolPath
}

function bazeliskDownloadUrl(version: string): string {
    if (process.platform == "win32") {
        return `https://github.com/bazelbuild/bazelisk/releases/download/v${version}/bazelisk-windows-amd64.exe`
    }
    if (process.platform == "darwin") {
        return `https://github.com/bazelbuild/bazelisk/releases/download/v${version}/bazelisk-darwin-amd64`
    }
    return `https://github.com/bazelbuild/bazelisk/releases/download/v${version}/bazelisk-linux-amd64`
}
