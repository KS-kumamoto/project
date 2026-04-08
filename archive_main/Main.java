import java.io.*;
import java.util.*;

public class Main {
    
    // フェニック木 (Binary Indexed Tree / BIT)
    // 巨大な配列に対して「ある範囲にいくつデータがあるか？」を爆速（O(log N)）で数えてくれるデータ構造
    static class FenwickTree {
        int[] bit;
        int size;

        FenwickTree(int size) {
            this.size = size;
            bit = new int[size + 1];
        }

        // 指定した順位（ランク）の出現回数を増やす（+1する）
        void add(int rank, int val) {
            for (int i = rank; i <= size; i += i & -i) {
                bit[i] += val;
            }
        }

        // 1位から指定した順位（ランク）までに、今いくつデータが入っているかの総数を取得する
        int sum(int rank) {
            int result = 0;
            for (int i = rank; i > 0; i -= i & -i) {
                result += bit[i];
            }
            return result;
        }
    }

    // 大規模データ(N=200,000など)用、超高速で読み込むスキャナー
    static class FastScanner {
        BufferedReader br;
        StringTokenizer st;
        public FastScanner() {
            br = new BufferedReader(new InputStreamReader(System.in));
        }
        String next() {
            while (st == null || !st.hasMoreElements()) {
                try {
                    String line = br.readLine();
                    if (line == null) return null;
                    st = new StringTokenizer(line);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return st.nextToken();
        }
        int nextInt() {
            return Integer.parseInt(next());
        }
        long nextLong() {
            return Long.parseLong(next());
        }
    }

    public static void main(String[] args) {
        FastScanner sc = new FastScanner();
        
        String startCheck = sc.next();
        if (startCheck == null) return;
        
        int n = Integer.parseInt(startCheck);
        int m = sc.nextInt();    // 最小人数
        int limitM = sc.nextInt(); // 最大人数
        long targetAverage = sc.nextLong(); // 1人あたりの目標基準（T）

        long[] scores = new long[n];
        for (int i = 0; i < n; i++) {
            scores[i] = sc.nextLong();
        }

        // ---------------------------------------------------------
        // ① 足し算の変換と累積和
        // ---------------------------------------------------------
        // 「合計が 人数×T 以上か？」という条件は、あらかじめ全員のスコアからTを引いた状態の配列で
        // 「合計が 0 以上か？」を調べることと数学的に全く同じです。
        long[] P = new long[n + 1];
        P[0] = 0;
        for (int i = 0; i < n; i++) {
            // 前の合計値に、今の人の(スコア - 基準)を足して保存していく
            P[i + 1] = P[i] + (scores[i] - targetAverage);
        }

        // ---------------------------------------------------------
        // ② 座標圧縮（ランキング化）
        // ---------------------------------------------------------
        // 累積和の値（-10億〜10億など）が大きすぎてそのまま配列の添え字として使えないため、
        // 「小さい順に何番目か（ランク何位か）」という扱いやすい数字（1〜N+1位）に変換します。
        long[] sortedP = P.clone();
        Arrays.sort(sortedP);
        
        int distinctCount = 1;
        for (int i = 1; i <= n; i++) {
            if (sortedP[i] != sortedP[i - 1]) {
                sortedP[distinctCount++] = sortedP[i]; // 重複を消して詰める
            }
        }
        long[] rankingTable = Arrays.copyOf(sortedP, distinctCount);

        // ---------------------------------------------------------
        // ③ フェニック木による高速探索（スライディングウィンドウの進化版）
        // ---------------------------------------------------------
        // ランクの数だけ容量を持ったフェニック木を作成
        FenwickTree tree = new FenwickTree(distinctCount);
        long answerCount = 0;

        // グループの右端（終了位置）r を動かしていく。
        // 右端が r のとき、左端 k としてあり得る範囲は「(r - limitM) 〜 (r - m)」になります。
        for (int r = m; r <= n; r++) {
            
            // 探索範囲に入ってきた新しい左端 k ( r-m ) の値（ランク）を計算して、木に1個追加する
            int addRank = Arrays.binarySearch(rankingTable, P[r - m]) + 1;
            tree.add(addRank, 1);

            // 探索範囲から外れてしまった古い左端 k ( r-limitM-1 ) を、木から1個削除する
            if (r - limitM - 1 >= 0) {
                int removeRank = Arrays.binarySearch(rankingTable, P[r - limitM - 1]) + 1;
                tree.add(removeRank, -1);
            }

            // 【判定の極意】
            // グループ合計が0以上になる条件は、「左端P[k] の値が、右端P[r] の値以下であること」です。(P[r] - P[k] >= 0)
            // なので、現在の木の中に入っている左端（候補）のうち、「P[r]のランク以下のものが何個あるか？」を
            // 聞き出せば、条件を満たすグループの数が一瞬で数えられます！
            int queryRank = Arrays.binarySearch(rankingTable, P[r]) + 1;
            answerCount += tree.sum(queryRank);
        }

        System.out.println(answerCount);
    }
}
