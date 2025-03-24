# 设置仓库路径和目标分支名称列表
$repoPath = "D:\demo\zzx\vue-pure-admin"
$targetBranches = @("ota", "operation")
$n = 5  # 要检查的最新提交记录数量
$maxCommitsToSync = 1  # 最大处理的提交记录数量

# 进入仓库目录
Set-Location -Path $repoPath

# 获取当前分支名称
$currentBranch = git rev-parse --abbrev-ref HEAD

# 获取最新的n条提交记录信息
$latestCommits = git log -$n --pretty=format:"%H %s"

# 分析提交记录
$commitsToSync = @()
foreach ($commit in $latestCommits) {
    if ($commit -match "sync") {
        Write-Output "Found commit with the word 'sync': $commit"
        $commitsToSync += $commit.Split(" ")[0]
    }
}

# 限制处理的提交记录数量
$commitsToSync = $commitsToSync[0..($maxCommitsToSync - 1)]

# 检查是否有需要同步的提交记录
if ($commitsToSync.Count -gt 0) {
    # 遍历每个目标分支并进行合并
    foreach ($branch in $targetBranches) {
        # 切换到目标分支
        git checkout $branch

        foreach ($commitHash in $commitsToSync) {
            # 合并最新的提交记录
            git cherry-pick $commitHash

            # 提交合并结果
            git commit -m "Merge commit $commitHash to $branch"

            Write-Output "Commit $commitHash has been merged to $branch"
        }

        # Push到远程分支
        git push origin-github $branch
        Write-Output "Changes have been pushed to the remote branch $branch"
    }

    # 切换回原来的分支
    git checkout $currentBranch
    Write-Output "Switched back to the original branch $currentBranch"
} else {
    Write-Output "No commit with the word 'sync' found in the latest $n commits"
}
