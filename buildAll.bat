@ECHO OFF
ECHO =========== BUILD SMART LIGHTING SYSTEM ===========
ECHO OPEN EXECUTABLES FOLDER
F:
cd F:\Master\MasterAn2Sem2\proiect cercetare\executables
ECHO DELETE ALL LOGS
del *.log
ECHO 1) BUILD CCU
ECHO ===================================================
compiler.exe ../ccu_node/start-ccu.js ccu
ECHO ===================================================
ECHO 2) BUILD PCU
ECHO ===================================================
compiler.exe ../pcu_node/start-pcu.js pcu
ECHO ===================================================
ECHO 3) BUILD POLE
ECHO ===================================================
compiler.exe ../pole_node/start-pole.js pole
ECHO 4) BUILD START
ECHO ===================================================
compiler.exe ../init_script/main.js start-all
ECHO ===================================================
ECHO ============ BUILD DONE SUCCESSFULLY ==============
pause