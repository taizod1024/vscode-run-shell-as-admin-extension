# run-shell-as-admin

Output Windows application, package list with version and config.
Use it with Git.

- run-shell-as-admin
  - os
    - system information  
      ```
      systeminfo
      ```
    - windows features
      ```
      dism /Online /Get-Features /English
      ```
    - environment variables
  - package
    - windows application list  
      ```
      reg query HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall /s
      reg query HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall /s
      reg query HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall /s
      ```
    - chocolatey package list and config
      ```
      choco list --local-only
      choco config list
      ```
    - nodejs package list and config
      ```
      npm list --global
      npm config list
      nvm list
      ```
    - python package list and config
      ```
      pip list
      pip config list
      ```
    - vscode extension list  
      ```
      code --list-extensions -show-versions
      ```
    - git config
      ```
      git config --list
      ```
