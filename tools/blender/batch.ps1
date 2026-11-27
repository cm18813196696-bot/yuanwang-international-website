param([string]$Tag,[string]$Res='640x480',[int]$Spp=64,[string[]]$Jobs)
# each job: name|glb|env|extra args (space separated)
$S="C:\Users\cm188\AppData\Local\Temp\claude\7cb7384ae21d151b\cd48a057-a26c-469e-b252-8606d4726fc8\scratchpad"
$B="C:\Program Files\Blender Foundation\Blender 5.3\blender.exe"; $TEX="$S\yw-repo\stavsjo\tex"
Add-Type -AssemblyName System.Drawing
$outs=@()
foreach($j in $Jobs){
  $p=$j -split '\|'; $name=$p[0]; $o="$S\blender\out\$Tag`_$name.png"
  $extra=@(); if($p.Count -gt 3){ $extra=$p[3] -split ' ' }
  $t0=Get-Date
  & $B -b -P "$S\blender\render.py" -- "glb=$S\blender\in\$($p[1]).glb" "hdri=$S\blender\env\$($p[2])" "out=$o" "res=$Res" "spp=$Spp" fixnormals=1 "tex=$TEX" @extra 2>&1 | Select-String 'Traceback|Error:' | % Line
  "$name : $([int]((Get-Date)-$t0).TotalSeconds)s"
  $outs+=$o
}
$wh=$Res -split 'x'; $w=[int]$wh[0]; $h=[int]$wh[1]; $sc=[Math]::Min(1,640/$w); $cw=[int]($w*$sc); $ch=[int]($h*$sc)
$cols=2; $rows=[Math]::Ceiling($outs.Count/$cols)
$sheet=New-Object Drawing.Bitmap ($cw*$cols),($ch*$rows); $g=[Drawing.Graphics]::FromImage($sheet); $font=New-Object Drawing.Font 'Arial',13,([Drawing.FontStyle]::Bold)
for($i=0;$i -lt $outs.Count;$i++){ if(-not (Test-Path $outs[$i])){continue}; $img=[Drawing.Image]::FromFile($outs[$i]); $x=($i%$cols)*$cw; $y=[Math]::Floor($i/$cols)*$ch; $g.DrawImage($img,$x,$y,$cw,$ch); $g.DrawString([IO.Path]::GetFileNameWithoutExtension($outs[$i]),$font,[Drawing.Brushes]::Yellow,$x+5,$y+5); $img.Dispose() }
$g.Dispose(); $sheet.Save("$S\blender\out\$Tag-sheet.jpg",[Drawing.Imaging.ImageFormat]::Jpeg); "$S\blender\out\$Tag-sheet.jpg"
