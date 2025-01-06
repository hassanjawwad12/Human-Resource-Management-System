import React, { Suspense } from "react";
import Spinner from "../../../../views/spinner/Spinner";
import { Box } from "@mui/system";


export const Loader = () => {
  return (<Box
    sx={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '@keyframes scale': {
        '0%': {
          transform: 'scale(0.8)',
        },
        '50%': {
          transform: 'scale(1.2)',
        },
        '100%': {
          transform: 'scale(0.8)',
        },
      },
    }}
  >
    <svg
      style={{
        animation: 'scale 2s infinite ease-in-out',
      }}
      className="relative z-20"
      viewBox="0 0 740 1100"
      version="1.1"

      height="100">

      version="1.1" xmlns="http://www.w3.org/2000/svg" width="50" height="50" overflow="visible" viewBox="0 0 500 500" xmlns:xlink="http://www.w3.org/1999/xlink"
      <path d="M0 0 C13.07978015 9.71877335 19.07047138 22.73308861 25.1875 37.3125 C25.87102086 38.92048442 26.55570522 40.52797467 27.24145508 42.13500977 C28.33526618 44.69877426 29.42829503 47.26284595 30.51786804 49.82841492 C34.58411557 59.40055049 38.73815778 68.9341347 42.89346313 78.46786499 C45.03955606 83.39285041 47.18179051 88.31951331 49.32421875 93.24609375 C49.93827827 94.65786644 49.93827827 94.65786644 50.56474304 96.09815979 C53.88346002 103.72909875 57.19389147 111.36359043 60.5 119 C65.84251027 131.33840697 71.20076499 143.66993638 76.5625 156 C76.98508087 156.97179199 77.40766174 157.94358398 77.8430481 158.94482422 C80.89510435 165.96332968 83.94751567 172.9816807 87 180 C90.47940297 187.99989725 93.95866159 195.99985723 97.4375 204 C97.86064484 204.97308105 98.28378967 205.94616211 98.71975708 206.94873047 C104.15741395 219.45407455 109.58688498 231.96290011 115.00537109 244.4765625 C119.84745386 255.6555175 124.70435681 266.82801657 129.5625 278 C129.98508087 278.97179199 130.40766174 279.94358398 130.8430481 280.94482422 C133.89510435 287.96332968 136.94751567 294.9816807 140 302 C145.54801402 314.75607985 151.09569381 327.51230406 156.64012146 340.26994324 C158.3959323 344.30998917 160.15200204 348.3499209 161.90966797 352.38916016 C165.08663396 359.69058339 168.25359464 366.99620872 171.40527344 374.30859375 C172.53870571 376.93589368 173.67843297 379.56037977 174.82128906 382.18359375 C176.41534081 385.84314443 177.9989808 389.50706485 179.57672119 393.17367554 C180.17626728 394.56255594 180.77906963 395.95003689 181.38568115 397.33584595 C191.05263908 419.43866015 199.31844415 444.40711307 190.21383667 468.04071045 C188.2451364 472.84096601 186.13024867 477.57556734 183.99868774 482.30529785 C182.77898821 485.01186412 181.57101237 487.72340338 180.3659668 490.43652344 C179.11811152 493.24586485 177.86966931 496.05492328 176.61775208 498.86245728 C172.78311093 507.46340977 169.03696743 516.10090516 165.3125 524.75 C164.01108145 527.76721413 162.7087055 530.78401462 161.40625 533.80078125 C160.89789612 534.97859665 160.89789612 534.97859665 160.37927246 536.1802063 C155.37371642 547.77320354 150.3410426 559.35446071 145.3125 570.9375 C143.31896595 575.52992861 141.32549247 580.12238352 139.33203125 584.71484375 C138.85816483 585.80648834 138.3842984 586.89813293 137.89607239 588.02285767 C134.42749877 596.01384769 130.96223068 604.00625987 127.5 612 C122.20887144 624.21522266 116.91036238 636.42723738 111.61077881 648.63879395 C110.11947638 652.07522817 108.62832996 655.51173007 107.13720703 658.94824219 C102.62526444 669.34612069 98.11232951 679.74356201 93.59341431 690.13841248 C91.65065504 694.6076158 89.70881635 699.07721888 87.76702881 703.54684448 C86.87835818 705.59173768 85.98928025 707.63645395 85.09967041 709.68093872 C74.62983113 733.74327754 64.33724904 757.87975223 54 782 C95.58 782 137.16 782 180 782 C180.99 779.03 181.98 776.06 183 773 C184.00374879 770.56457139 185.04277707 768.14337301 186.1171875 765.73828125 C186.40997589 765.07923798 186.70276428 764.4201947 187.00442505 763.74118042 C187.63123004 762.33125519 188.25984253 760.9221323 188.89013672 759.51376343 C190.59966832 755.69279714 192.2946078 751.8653497 193.9921875 748.0390625 C194.33642761 747.26421005 194.68066772 746.4893576 195.03533936 745.69102478 C198.06252397 738.87328755 201.04152023 732.03533302 204 725.1875 C204.78156264 723.37983367 205.56312606 721.57216767 206.3447113 719.76451111 C206.91311742 718.44981672 207.48144383 717.13508788 208.04969788 715.82032776 C212.70930136 705.04197765 217.38757301 694.27170971 222.0625 683.5 C222.55538513 682.36419495 223.04827026 681.22838989 223.55609131 680.0581665 C230.99360874 662.91930223 238.43956624 645.78412252 245.8911438 628.65136719 C250.76831387 617.43750285 255.64113677 606.22180969 260.5 595 C265.77932028 582.80712182 271.07574566 570.62172591 276.375 558.4375 C281.86509277 545.81385162 287.3532478 533.18936572 292.8359375 520.5625 C293.568694 518.87521286 293.568694 518.87521286 294.31625366 517.15383911 C296.76732145 511.50875218 299.21589853 505.862606 301.65966797 500.21435547 C305.68553713 490.91308554 309.71343806 481.61391695 313.83551025 472.3547821 C315.37624844 468.89270141 316.90684871 465.42618561 318.43664551 461.95925903 C319.13707664 460.38051491 319.84292335 458.80416067 320.55456543 457.23043823 C321.51866677 455.09814829 322.46431663 452.95855964 323.40625 450.81640625 C323.93541016 449.63506104 324.46457031 448.45371582 325.00976562 447.23657227 C327.01325652 440.68818004 324.09287517 435.4266387 321.421875 429.5 C321.05953262 428.68102234 320.69719025 427.86204468 320.3238678 427.01824951 C319.54500089 425.25996695 318.76300335 423.50306844 317.97817993 421.74743652 C316.73020987 418.95572951 315.49034964 416.16054779 314.25268555 413.36425781 C312.59239446 409.61359112 310.92963736 405.86403463 309.26513672 402.11523438 C306.40978656 395.67638351 303.60377779 389.21689279 300.8125 382.75 C300.05015778 380.98695185 299.28780979 379.22390619 298.52528381 377.4609375 C297.97451961 376.18754102 297.42385293 374.91410236 296.87327576 373.640625 C292.23847882 362.92255232 287.5864208 352.21195154 282.9375 341.5 C282.4420166 340.3582431 281.9465332 339.21648621 281.43603516 338.04013062 C271.3019892 314.68850473 261.15304854 291.34336859 251 268 C247.72891024 260.47927817 244.45799349 252.95848115 241.1875 245.4375 C240.77956207 244.49939484 240.37162415 243.56128967 239.95132446 242.59475708 C232.63765284 225.77505673 225.33558691 208.95033101 218.0355835 192.12469482 C211.71014431 177.54562842 205.38097823 162.96819475 199.04373169 148.39425659 C197.82241557 145.58530519 196.60148028 142.7761885 195.38061523 139.96704102 C191.55341669 131.16225625 187.72189426 122.35940206 183.87922668 113.56135559 C182.04641548 109.36427348 180.21567202 105.16629091 178.38510132 100.9682312 C177.51734022 98.97976303 176.64857905 96.99173093 175.77871704 95.00418091 C156.10825876 50.05696456 156.10825876 50.05696456 165.74755859 25.06152344 C172.46670514 9.16490539 183.09918461 -0.5264004 198.9453125 -6.95703125 C205.69004578 -9.25990054 211.65752345 -10.36621926 218.75 -10.3125 C219.93070068 -10.30404053 219.93070068 -10.30404053 221.13525391 -10.29541016 C236.66784018 -9.97465955 250.84034373 -3.87689471 262 7 C271.20075226 17.66301467 276.41078493 30.67386684 281.83300781 43.51660156 C283.45758526 47.36264593 285.0959063 51.20282594 286.734375 55.04296875 C287.07891724 55.85083832 287.42345947 56.65870789 287.77844238 57.49105835 C291.78151944 66.85843853 295.89151238 76.17850418 300 85.5 C305.56765987 98.1383992 311.08197344 110.79672357 316.5 123.5 C321.85586453 136.05738322 327.30782003 148.56965947 332.8125 161.0625 C338.9567688 175.00738735 345.01690117 188.98521745 351 203 C356.9652726 216.97169339 363.0026597 230.90889767 369.125 244.8125 C374.7497159 257.58656956 380.34484759 270.37218337 385.875 283.1875 C391.7501242 296.80072689 397.64731318 310.40412931 403.5625 324 C410.8839019 340.82947815 418.19564662 357.66311534 425.5 374.5 C432.65972454 391.00302426 439.82502816 407.50359898 447 424 C454.66207249 441.61632285 462.31242609 459.23770818 469.95819092 476.8611145 C477.2617122 493.69528175 484.57419036 510.52553066 491.89306641 527.35302734 C497.27572956 539.72916234 502.65023214 552.10875111 508.01269531 564.49365234 C512.78913367 575.52138541 517.58181021 586.54203938 522.375 597.5625 C529.75827361 614.53808191 537.13234494 631.51763373 544.5 648.5 C551.25437689 664.06859822 558.01275516 679.63543654 564.78131104 695.19787598 C568.08128831 702.78549338 571.38021622 710.37356712 574.67907715 717.96166992 C575.58177892 720.03802581 576.4845319 722.11435943 577.3873291 724.19067383 C584.14238809 739.72678913 590.88766792 755.2671022 597.61950684 770.81329346 C598.98513769 773.96569211 600.35227645 777.11743311 601.71972656 780.26904297 C603.84314387 785.16441642 605.96059685 790.06232779 608.07342529 794.96228027 C608.84629039 796.75241498 609.62101365 798.54174882 610.39776611 800.3302002 C620.58749857 823.80198494 620.58749857 823.80198494 620.4375 835.8125 C620.42920166 836.68269775 620.42090332 837.55289551 620.41235352 838.44946289 C620.03300324 853.02812336 614.01299743 867.56740249 603.93359375 878.23046875 C592.03497766 889.11950529 575.90151423 895.96366347 559.6015625 895.2734375 C543.25074516 893.55488312 528.15466942 887.34560644 517 875 C510.86951502 866.74510682 506.89936477 857.57002807 502.875 848.1875 C502.22038303 846.68030798 501.56493162 845.17347814 500.90869141 843.66699219 C499.24576135 839.84397369 497.59340177 836.01648839 495.94384766 832.18768311 C494.50050849 828.84226112 493.04720777 825.5011914 491.59375 822.16015625 C488.90796229 815.9821953 486.23333884 809.79945929 483.56201172 803.61523438 C481.02432847 797.74183432 478.48121493 791.87078983 475.9375 786 C475.41406006 784.79182617 474.89062012 783.58365234 474.35131836 782.33886719 C466.78871224 764.88784537 459.19826451 747.4489032 451.61279297 730.0078125 C446.99387921 719.38746757 442.37655728 708.76643047 437.75897217 698.14550781 C436.51510651 695.28450065 435.27122959 692.42349839 434.02734375 689.5625 C433.61625366 688.61697266 433.20516357 687.67144531 432.78161621 686.69726562 C429.77285235 679.7771381 426.76345899 672.85728448 423.75390625 665.9375 C419.20057038 655.46794089 414.6484471 644.99785536 410.09814453 634.52697754 C409.38301584 632.88137071 408.66784854 631.23578066 407.95263672 629.59020996 C406.09388291 625.31340935 404.23602428 621.03622261 402.37985229 616.75830078 C401.60152865 614.9649278 400.82239219 613.17190764 400.04321289 611.37890625 C396.96454464 604.27878407 393.95695339 597.15166383 391 590 C382.29302248 609.23092566 373.83013208 628.55859634 365.47583008 647.94491577 C360.58722742 659.28444283 355.66722202 670.61036231 350.75 681.9375 C350.26028717 683.06576202 349.77057434 684.19402405 349.26602173 685.35647583 C340.00376143 706.69591326 330.72981788 728.03026374 321.45166016 749.36279297 C318.55320751 756.02710785 315.65549586 762.69174483 312.75796509 769.35646057 C310.68005046 774.13594739 308.60196951 778.91536171 306.5234375 783.69458008 C302.66872106 792.55830132 298.81568301 801.42274008 294.96878052 810.28985596 C293.18046655 814.41163038 291.39117015 818.532978 289.60180664 822.65429688 C288.76115057 824.59126015 287.92095887 826.52842506 287.08129883 828.46582031 C284.78060421 833.77417672 282.47148321 839.0786919 280.14825439 844.37722778 C279.36126693 846.17481625 278.5770207 847.97360661 277.79510498 849.77340698 C276.60456666 852.51011718 275.40316071 855.24182057 274.19921875 857.97265625 C273.66570549 859.20702927 273.66570549 859.20702927 273.12141418 860.46633911 C270.13677043 867.185059 266.56963745 872.10958663 261 877 C260.28070313 877.6496875 259.56140625 878.299375 258.8203125 878.96875 C253.39448772 883.52567046 247.5875568 886.46224322 241 889 C240.07058594 889.35964844 239.14117187 889.71929688 238.18359375 890.08984375 C219.7729005 896.45077427 199.92879044 896.4427184 180.68359375 896.38818359 C178.23018665 896.39226034 175.77678138 896.39760835 173.32337952 896.40411377 C167.41140572 896.41625835 161.49953752 896.41464172 155.58756691 896.40587585 C150.77842053 896.39904555 145.96930611 896.39820536 141.16015625 896.4014473 C140.12576709 896.40213684 140.12576709 896.40213684 139.07048118 896.40284032 C137.66882816 896.40379967 136.26717515 896.40477231 134.86552215 896.4057581 C121.79190814 896.41426721 108.71835774 896.40454611 95.64475417 896.388357 C84.45861304 896.37493386 73.27256527 896.37730702 62.08642578 896.39111328 C49.04085604 896.40720735 35.99534158 896.41346872 22.9497633 896.40427649 C21.55628142 896.40332099 20.16279953 896.40237788 18.76931763 896.4014473 C17.74131966 896.40075306 17.74131966 896.40075306 16.69255406 896.40004479 C11.89234293 896.39746815 7.09216729 896.40179656 2.29196167 896.40888596 C-4.17613699 896.41823056 -10.64410138 896.41147604 -17.11218452 896.39420319 C-19.47677889 896.39025652 -21.84138818 896.39134094 -24.20597649 896.39799118 C-44.81009136 896.45057315 -63.11606427 895.4160783 -78.81640625 880.34375 C-89.49587567 868.88099212 -94.58336302 853.72563182 -94.24609375 838.19140625 C-93.58685385 829.6422158 -91.44665532 821.76544132 -88.22265625 813.83984375 C-87.95782944 813.18766876 -87.69300262 812.53549377 -87.42015076 811.86355591 C-84.88947711 805.66232758 -82.24454459 799.51211741 -79.5625 793.375 C-79.01587189 792.11932706 -78.46949765 790.86354358 -77.92333984 789.60766602 C-76.67227861 786.73138164 -75.42013636 783.85557069 -74.16748047 780.97998047 C-71.72257224 775.36511051 -69.28493516 769.74709126 -66.84765625 764.12890625 C-66.15968208 762.5430648 -66.15968208 762.5430648 -65.45780945 760.92518616 C-64.50234655 758.72270279 -63.54689738 756.52021346 -62.59146118 754.31771851 C-60.10846076 748.59435939 -57.62452489 742.8714063 -55.140625 737.1484375 C-54.12044246 734.79785167 -53.10026017 732.44726573 -52.08007812 730.09667969 C-50.53963458 726.54740292 -48.9991874 722.99812773 -47.45874023 719.44885254 C-43.93073387 711.3201087 -40.40280258 703.19133228 -36.875 695.0625 C-36.38541809 693.93439911 -35.89583618 692.80629822 -35.39141846 691.64401245 C-29.61295026 678.32891875 -23.83692413 665.01277931 -18.06787109 651.69360352 C-12.03878287 637.77663746 -5.99839807 623.86457159 0.04003906 609.95166016 C5.52992318 597.30250468 11.01941273 584.65318674 16.5 572 C22.28563676 558.64321632 28.08008573 545.29026079 33.875 531.9375 C34.36045288 530.81889587 34.84590576 529.70029175 35.34606934 528.54779053 C40.24917289 517.24990705 45.152598 505.95216316 50.05642891 494.65459538 C52.44497595 489.15178676 54.83337556 483.64891417 57.22174072 478.14602661 C58.72306337 474.68706054 60.22456701 471.22817307 61.72607422 467.76928711 C62.64551742 465.65088307 63.5649515 463.53247508 64.484375 461.4140625 C64.89895966 460.45916428 65.31354431 459.50426605 65.74069214 458.52043152 C66.4956841 456.78067983 67.24677967 455.03922941 67.99304199 453.29571533 C68.62529075 451.85428168 69.28419508 450.42395041 69.98059082 449.01239014 C71.97876153 444.87731431 72.27967243 442.40919681 71 438 C70.09278622 435.65021281 69.11099814 433.32857665 68.078125 431.03125 C67.78237076 430.36764465 67.48661652 429.70403931 67.18190002 429.02032471 C66.5442632 427.59158287 65.90350028 426.16423284 65.25991821 424.73815918 C63.87685342 421.67304053 62.50936533 418.60104946 61.14070129 415.52947998 C60.43786853 413.9526706 59.73423983 412.37621577 59.02983093 410.80010986 C55.90495534 403.80573501 52.84759916 396.78384723 49.8125 389.75 C48.75671486 387.307203 47.70075654 384.86448165 46.64453125 382.421875 C46.36688934 381.77959961 46.08924744 381.13732422 45.80319214 380.47558594 C41.98791342 371.65350738 38.15082018 362.84089708 34.31674194 354.02697754 C28.36938726 340.35496752 22.42384736 326.68221406 16.5 313 C11.15746708 300.66160281 5.79923503 288.33006367 0.4375 276 C0.01491913 275.02820801 -0.40766174 274.05641602 -0.8430481 273.05517578 C-3.89510435 266.03667032 -6.94751567 259.0183193 -10 252 C-13.47940297 244.00010275 -16.95866159 236.00014277 -20.4375 228 C-20.86064484 227.02691895 -21.28378967 226.05383789 -21.71975708 225.05126953 C-27.15741395 212.54592545 -32.58688498 200.03709989 -38.00537109 187.5234375 C-42.42185431 177.32706758 -46.8506306 167.1360591 -51.28161621 156.94598389 C-52.56076309 154.00399482 -53.83949871 151.06182728 -55.11816406 148.11962891 C-59.10132322 138.95588451 -63.08806216 129.79375085 -67.08872986 120.63763428 C-68.88075985 116.53562796 -70.67054985 112.432646 -72.46017456 108.32958984 C-73.3030757 106.39876489 -74.1470447 104.46840566 -74.99221802 102.53857422 C-79.24385322 92.82987085 -83.43914214 83.09877922 -87.453125 73.2890625 C-87.78237976 72.50123383 -88.11163452 71.71340515 -88.4508667 70.90170288 C-94.52903691 55.84324683 -94.64759096 40.49602526 -88.5234375 25.34765625 C-81.05995935 9.65390424 -70.77919681 -1.06529429 -54.4375 -7 C-35.48154092 -13.19672669 -16.99711846 -10.37410334 0 0 Z " fill="#45B4D3" transform="translate(113,21)"></path>
      <path d="M0 0 C12.83231165 9.83181525 21.06103286 23.02016134 24 39 C24.30694338 42.06875549 24.36990898 45.10488667 24.375 48.1875 C24.39949219 48.94869141 24.42398438 49.70988281 24.44921875 50.49414062 C24.50809617 62.35794087 19.23564868 73.29726723 14.5 83.9375 C13.94030649 85.21002759 13.38141889 86.48290987 12.82324219 87.75610352 C11.57964454 90.59125737 10.33267003 93.42489617 9.08398438 96.2578125 C6.80503198 101.43551379 4.54978069 106.62342248 2.296875 111.8125 C1.88852417 112.75303726 1.48017334 113.69357452 1.05944824 114.66261292 C0.21764418 116.60172482 -0.6241114 118.54085777 -1.46582031 120.48001099 C-3.62605807 125.45507755 -5.78946054 130.4287667 -7.953125 135.40234375 C-8.594776 136.87730568 -8.594776 136.87730568 -9.24938965 138.38206482 C-13.67216822 148.54712642 -18.10240438 158.70893237 -22.53366089 168.87030029 C-29.14028971 184.02059627 -35.73368266 199.17662863 -42.32128906 214.33520508 C-43.16340632 216.27295145 -44.00552874 218.21069558 -44.84765625 220.1484375 C-45.26707489 221.11353745 -45.68649353 222.07863739 -46.11862183 223.07298279 C-48.76677387 229.16553778 -51.41767271 235.25689024 -54.07060242 241.34736633 C-55.86634751 245.4700915 -57.66126566 249.59317648 -59.45614624 253.71627808 C-60.30146333 255.65747479 -61.1471699 257.59850195 -61.99331665 259.53933716 C-67.42057628 271.98851377 -72.76023204 284.47070565 -78 297 C-78.99 297 -79.98 297 -81 297 C-91.51471014 272.82669882 -102.02719904 248.65249531 -112.50097656 224.46142578 C-114.30351413 220.29914929 -116.10710261 216.13732894 -117.91203308 211.97608948 C-119.23903038 208.91627065 -120.56364508 205.85547196 -121.88500977 202.79321289 C-124.64900617 196.39033191 -127.43776073 189.99980573 -130.27122498 183.62730408 C-131.77803265 180.23406467 -133.2744693 176.83629939 -134.76986694 173.4380188 C-135.50220857 171.78099298 -136.23931879 170.1260659 -136.98135376 168.47335815 C-138.01801824 166.1632089 -139.03795862 163.8463216 -140.0546875 161.52734375 C-140.52546471 160.49498596 -140.52546471 160.49498596 -141.00575256 159.44177246 C-142.71219501 155.49778628 -143.43988898 153.08401963 -142 149 C-141.00781977 146.50053428 -139.97919221 144.05224194 -138.88671875 141.59765625 C-138.56548538 140.86485947 -138.24425201 140.13206268 -137.9132843 139.37705994 C-136.84249759 136.93687991 -135.76489324 134.49976941 -134.6875 132.0625 C-133.92456066 130.32642206 -133.1622034 128.59008821 -132.40039062 126.85351562 C-131.19342441 124.10252276 -129.9860266 121.35172621 -128.77682495 118.60171509 C-124.57507675 109.04543425 -120.41481781 99.4712759 -116.25750732 89.89559937 C-114.16191056 85.07017328 -112.06309991 80.24614512 -109.96484375 75.421875 C-107.08155769 68.79195856 -104.20161676 62.16060889 -101.32632446 55.52722168 C-99.77373559 51.94649755 -98.21898609 48.3667141 -96.66381836 44.78710938 C-95.9408156 43.12152642 -95.2187787 41.45552379 -94.49780273 39.7890625 C-83.62361357 14.65714533 -83.62361357 14.65714533 -74 5 C-73.44570313 4.4225 -72.89140625 3.845 -72.3203125 3.25 C-53.20991447 -15.00470856 -20.84528386 -14.0956814 0 0 Z " fill="#52C4C8" transform="translate(709,21)"></path>
    </svg>
  </Box >)
}



const Loadable = (Component) => (props) => {
  const [showSpinner, setShowSpinner] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  return <Suspense fallback={showSpinner ? <Loader /> : null}>
    <Component {...props} />
  </Suspense>
}

export default Loadable;