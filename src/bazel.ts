import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as installer from './installer';

async function run() {
    try {
        let bazeliskVersion = core.getInput('bazelisk-version');
        let bazeliskPath = await installer.getBazelisk(bazeliskVersion);
        let command = core.getInput('command').split(' ')
        let flags = [
            command[0],
            "--show_progress_rate_limit=30",
            "--terminal_columns=143",
            "--color=yes",
            "--curses=no",
            "--keep_going",
            "--experimental_multi_threaded_digest",
            "--experimental_repository_cache_hardlinks",
        ]
        if (process.platform == "win32") {
            flags.push("--enable_runfiles=true")
        }
        if (command[0] == "test") {
            flags.push("--test_output=errors")
        }
        flags = flags.concat(command.slice(1))
        await exec.exec(`${bazeliskPath} ${flags.join(' ')}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
