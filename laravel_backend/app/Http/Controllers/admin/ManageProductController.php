<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Validator;
use App\Models\loaisp;
//use App\Http\Resources\ProductResource;
use App\Models\Product as ModelsProduct;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ManageProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
         //$product= new Product ;
         //return $product::all(Product::paginate(2));

         $prd = Product::paginate();
         return $prd;
        //return ProductResource::collection(Product::paginate(2));
    }
    public function ctsp($product)
    {
        $SP=Product::find($product);
        $tenLoai= $SP->loaisp->tenLoai;
        $product = Product::find($product);
        return response()->json([
            'sanPham'=>$product,
            'tenSP'=>$tenLoai,
            ]);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($product)
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'tenSP' =>'required',
            'soLuongSP' =>'required|numeric',
            'maNSX' =>'required|max:10',
            'maNCC' =>'required|max:10',
            'gia' =>'required|numeric',
            'baoHanh' =>'required|numeric',
            'moTa' =>'required',
            'ctSanPham' =>'required',
        ]);
        if($validator->fails())
        {
            return response()->json([
                'status'=>400,
                'error'=>$validator->messages(),
            ]);
        }
        else
        {
            $product = new Product();
            //$product->maSP = $request->maSP;
            $product->tenSP = $request->tenSP;
            $product->soLuongSP = $request->soLuongSP;
            $product->maLoai = $request->maLoai;
            $product->maNSX = $request->maNSX;
            $product->maNCC = $request->maNCC;
            $product->gia = $request->gia;
            $product->baoHanh = $request->baoHanh;
            $product->moTa= $request->moTa;
            $product->ctSanPham= $request->ctSanPham;
            if($request->hasFile('hinh'))
            {
                $hinh = $request->file('hinh');
                $ext= $hinh->getClientOriginalExtension();
                $name = time().'_'.$hinh->getClientOriginalName();
                Storage::disk('public')->put($name,File::get($hinh));
                $product->hinh=$name;
            }else{
                $product->hinh='default.jpg';
            }
            $product->save();
            return response()->json([
                'status'=>200,
                'message'=>'Thêm sản phẩm thành công ',
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show( Product $product)
    {

        return new ProductResource($product);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $product = Product::find($id);
        return response()->json([
            'status'=>200,
            'product'=>$product,
            ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,$product)
    {
        $validator = Validator::make($request->all(),[
            'tenSP' =>'required',
            'soLuongSP' =>'required|numeric',
            'maNSX' =>'required|max:10',
            'maNCC' =>'required|max:10',
            'gia' =>'required|numeric',
            'baoHanh' =>'required|numeric',
            'moTa' =>'required',
            'ctSanPham' =>'required',
        ]);
        if($validator->fails())
        {
            return response()->json([
                'status'=>400,
                'error'=>$validator->messages(),
            ]);
        }
        else
        {
            $product =  Product::find($product);
            if($product)
            {
                $product->tenSP = $request->tenSP;
                $product->soLuongSP = $request->soLuongSP;
                $product->maLoai = $request->maLoai;
                $product->maNSX = $request->maNSX;
                $product->maNCC = $request->maNCC;
                $product->gia = $request->gia;
                $product->baoHanh = $request->baoHanh;
                $product->moTa= $request->moTa;
                $product->ctSanPham= $request->ctSanPham;
                if($request->hasFile('hinh'))
                {
                    $hinh = $request->file('hinh');
                    $ext= $hinh->getClientOriginalExtension();
                    $name = time().'_'.$hinh->getClientOriginalName();
                    Storage::disk('../public')->put($name,File::get($hinh));
                    $product->hinh=$name;
                }else{
                    $product->hinh='default.jpg';
                }
                $product->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Cập nhật thành công',
                    ]);
            }
            else
            {
                return response()->json([
                    'status'=>200,
                    'message'=>'Không tìm thấy sản phẩm',
                    ]);

            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($product)
    {
        $product = Product::find($product);
        if($product)
        {
            $product->delete();
            return response()->json([
                'status'=>200,
                'message'=>'Xoá thành công',
                ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'Không tìm thấy sản phẩm cần xoá',
                ]);
        }
    }
    public function search(Request $request)
    {
        $product_query =  Product::with('loaisp');
        //$product = $product_query->get();
        if($request->keyword)
        {
         $product_query->where('tenSP','LIKE','%'.$request->keyword.'%');
         //$product_query->where('moTa','LIKE','%'.$request->keyword.'%');
         //$product_query->where('ctSanPham','LIKE','%'.$request->keyword.'%');
        }
        if($request->loaisp)
        {
            $product_query->whereHas('loaisp',function($query) use ($request){
                    $query->where('tenLoai',$request->loaisp);
            });
        }
        $product = $product_query->get();
        return response()->json([
            'data'=>$product,
            'message'=>'kết quả',
            ]);
    }
}