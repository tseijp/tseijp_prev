// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus/src/commands/deploy.ts
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import $ from 'zx'
import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import chalk from 'chalk'
import build from './build'

const env = typeof process === 'undefined'? {}: process.env

export async function build () {
    await $``
}

export async function deploy (siteConfig = {
          githubHost: 'tsei',
          githubPort: 'tsei',
         projectName: 'tsei',
    organizationName: 'tsei'
}) {
    const currentBranch = env.CURRENT_BRANCH || await $`git rev-parse --abbrev-ref HEAD`.stdout.trim(),
                gitUser = env.GIT_USER,
                gitPass = env.GIT_PASS,
         gitCredentials = gitPass? `${gitUser}:${gitPass}`: `${gitUser}`,
             githubHost = env.GITHUB_HOST || siteConfig.githubHost || 'github.com',
             githubPort = env.GITHUB_PORT || siteConfig.githubPort,
            projectName = env.PROJECT_NAME || siteConfig.projectName,
       organizationName = env.ORGANIZATION_NAME|| siteConfig.organizationName,
       deploymentBranch = projectName.indexOf('.github.io') !== -1 ? 'master': 'gh-pages',
           remoteBranch = buildUrl(gitCredentials, githubHost, organizationName, projectName, githubPort)
    consoleLogCyan({currentBranch, gitUser, gitPass, projectName, organizationName, deploymentBranch, githubHost})
    const fromPath = await build()
    const toPath = path.join(os.tmpdir(), `${projectName}-${deploymentBranch}`)
    await fs.mkdtemp(toPath)
    if (await $`git clone ${remoteBranch} ${toPath}`.code !== 0)
        throw new Error(`Error: git clone failed in ${toPath}`)
    await $`cd ${toPath}`
    const defaultBranch = await $`git rev-parse --abbrev-ref HEAD`.stdout.trim()
    if (defaultBranch !== deploymentBranch) {
        if (await $`git checkout origin/${deploymentBranch}`.code !== 0 &&
            await $`git checkout --orphan ${deploymentBranch}`.code !== 0)
            throw new Error(`Error: Git checkout ${deploymentBranch} failed`)
        else
        if (await $`git checkout -b ${deploymentBranch}`.code &&
            await $`git branch --set-upstream-to=origin/${deploymentBranch}`.code)// !== 0
            throw new Error(`Error: Git checkout ${deploymentBranch} failed`)
    }

    await $`git rm -rf .`
    await fs.copy(fromPath, toPath)
    await $`cd ${toPath}`
    await $`git add --all`
    const currentCommit = await $`git rev-parse HEAD`.stdout.trim()
    const commitMessage = `Deploy website - based on ${currentCommit}`
    const commitResults = await $`git commit -m "${commitMessage}"`.stdout.trim()

    if ($`git push --force origin ${deploymentBranch}`.code !== 0)
        throw new Error('Error: Git push failed')
    if (commitResults.code === 0) {
        let websiteURL = ''
        if (githubHost === 'github.com')
            websiteURL = projectName.includes('.github.io')
                ? `https://${organizationName}.github.io/`
                : `https://${organizationName}.github.io/${projectName}/`
        else
            websiteURL = `https://${githubHost}/pages/${organizationName}/${projectName}/`
        await $`echo Website is live at ${websiteURL}`
        await $`exit 0` // $.exit(0)
    }
}

function consoleLogCyan (obj={}) {
    for(const key in obj)
        if (obj[key])
            console.log(`${chalk.cyan(`${key}`)} ${obj[key]}`)
        else throw new Error (
            `Missing ${key}. Did you forget to define '${key}' in ${obj[key]}?`
        )
}

function buildUrl(
      gitCredentials: string | undefined,
          githubHost: string,
    organizationName: string,
         projectName: string,
          githubPort: string | undefined,
) {
    return githubPort
        ? `https://${gitCredentials}@${githubHost}:${githubPort}/${organizationName}/${projectName}.git`
        : `https://${gitCredentials}@${githubHost}/${organizationName}/${projectName}.git`
}
