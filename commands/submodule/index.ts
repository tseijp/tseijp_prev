/*
# Shows you the largest objects in your repo's pack file.
# Written for osx.
#
# @see http://stubbisms.wordpress.com/2009/07/10/git-script-to-show-largest-pack-objects-and-trim-your-waist-line/
# @author Antony Stubbs
*/
import $ from 'zx'
import chalk from 'chalk'
import { promise as fs} from 'fs'

export interface Submodule {
    (): void
    add (submoduleURL: string, submodulePath: string, branch: string) : void
    rm (submodule: string, submodulePath: string, initialized?: boolean): void
    findBig (): void
}

export const submodule: Submodule = () => {}

/**
 * https://stackoverflow.com/questions/1260748/how-do-i-remove-a-submodule
 * https://nju33.com/notes/git/articles/Submodule%20%E3%82%92%E5%89%8A%E9%99%A4%E3%81%99%E3%82%8B
 * https://chaika.hatenablog.com/entry/2017/05/05/090000
 */

/**
 * https://git-scm.com/docs/git-submodule
 * https://git-scm.com/book/en/v2/Git-Tools-Submodules
 *  git submodule [--quiet] add [-b <branch>] [-f|--force] [--name <name>] [--reference <repository>] [--] <repository> [<path>]
 */
submodule.add = (submoduleURL, submodulePath='', branch='master') => {
    $`git submodule add ${branch? '-b '+ branch: ''} ${submodule} ${submodulePath}`
    $`git submodule update --init --remote --recursive`
}

submodule.rm = (submodule, submodulePath, initialized=true) => {
    if (!initialized) {
        $`git reset`
        $`git config --local --remove-section submodule.${submodulePath}`
        $`git config -f .gitmodules --remove-section submodule.${submodulePath}`
    } else {
        $`git submodule deinit -f ${submodule}`
        $`git rm --cahced ${submodule}`
        fs.rm(`./.git/modules/${submodule}`)
    }
    fs.rm(submodulePath)
}

/**
 *  find Big
 */
submodule.findBig = () => {
    // set the internal field spereator to line break, so that we can iterate easily over the verify-pack output
    $`IFS=$'\n'`

    //  list all objects including their size, sort by size, take top 10
    const objects=$`git verify-pack -v .git/objects/pack/pack-*.idx | grep -v chain | sort -k3nr | head`
    $`echo "All sizes are in kB's. The pack column is the size of the object, compressed, inside the pack file."`
    let output = "size,pack,SHA,location"
    for (let y in objects) {
        // extract the size in bytes
        const size = $`echo $y | cut -f 5 -d ' '` / 1024

        // extract the compressed size in bytes
        const compressedSize=$`echo $y | cut -f 6 -d ' '` / 1024
        // extract the SHA
        const sha = $`echo $y | cut -f 1 -d ' '`
        // find the objects location in the repository tree
        const other=`git rev-list --all --objects | grep $sha`
        // cibst #lineBreak=`echo -e "\n"`
        output = `${output}\n${size},${compressedSize},${other}`
    }
    $`echo -e $output | column -t -s ', '`
}
